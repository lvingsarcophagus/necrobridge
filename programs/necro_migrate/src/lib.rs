declare_id!("2z3U1Wwq7bgHnkEuD5Yfw97g8uGyimDyRafRar21Bsva");

// pub mod instructions; // Duplicate account structs - use definitions in lib.rs instead

use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenInterface, TokenAccount};
use std::mem::size_of;

#[program]
pub mod necro_migrate {
    use super::*;

    pub fn initialize_migration(
        ctx: Context<InitializeMigration>,
        name: [u8; 64],
        source_chain: u16,
        source_address: [u8; 32],
        snapshot_root: [u8; 32],
        total_supply: u64,
    ) -> Result<()> {
        let migration = &mut ctx.accounts.migration;
        migration.name = name;
        migration.admin = ctx.accounts.admin.key();
        migration.source_chain = source_chain;
        migration.source_address = source_address;
        migration.snapshot_root = snapshot_root;
        migration.total_supply = total_supply;
        migration.bump = ctx.bumps.migration;
        migration.migrated_amount = 0;
        migration.is_active = true;
        
        msg!("Migration initialized");
        Ok(())
    }

    pub fn claim_tokens(
        ctx: Context<ClaimTokens>,
        amount: u64,
        merkle_proof: Vec<[u8; 32]>,
        leaf_index: u32,
    ) -> Result<()> {
        let migration = &ctx.accounts.migration;
        require!(migration.is_active, ErrorCode::MigrationNotActive);
        require!(amount > 0, ErrorCode::InvalidAmount);

        let user_claim = &mut ctx.accounts.user_claim;
        require!(!user_claim.is_claimed, ErrorCode::AlreadyClaimed);

        // Verify merkle proof
        let leaf = anchor_lang::solana_program::hash::hashv(&[
            ctx.accounts.user.key().as_ref(),
            &amount.to_le_bytes(),
            &leaf_index.to_le_bytes(),
        ]);

        let mut current_hash = leaf.to_bytes();
        for proof_hash in merkle_proof {
            current_hash = if current_hash < proof_hash {
                anchor_lang::solana_program::hash::hashv(&[&current_hash, &proof_hash]).to_bytes()
            } else {
                anchor_lang::solana_program::hash::hashv(&[&proof_hash, &current_hash]).to_bytes()
            };
        }

        require!(current_hash == migration.snapshot_root, ErrorCode::InvalidMerkleProof);

        // Mark as claimed
        user_claim.user = ctx.accounts.user.key();
        user_claim.is_claimed = true;
        user_claim.amount = amount;

        // Transfer tokens to user
        let token_program = &ctx.accounts.token_program;
        let cpi_accounts = anchor_spl::token_interface::TransferChecked {
            from: ctx.accounts.token_vault.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.migration_authority.to_account_info(),
        };

        let seeds = &[
            b"migration",
            migration.admin.as_ref(),
            &migration.source_chain.to_le_bytes(),
            &[migration.bump],
        ];
        let signer = &[&seeds[..]];

        anchor_spl::token_interface::transfer_checked(
            CpiContext::new_with_signer(token_program.to_account_info(), cpi_accounts, signer),
            amount,
            ctx.accounts.mint.decimals,
        )?;

        msg!("User {} claimed {} tokens", ctx.accounts.user.key(), amount);
        Ok(())
    }

    pub fn finalize_migration(ctx: Context<FinalizeMigration>) -> Result<()> {
        let migration = &mut ctx.accounts.migration;
        require!(migration.admin == ctx.accounts.admin.key(), ErrorCode::Unauthorized);
        migration.is_active = false;
        msg!("Migration finalized");
        Ok(())
    }

    /// Initialize a DAO-controlled liquidity pool to prevent "day 2 death"
    /// Ensures liquidity stays with the community, not individual whales
    pub fn initialize_dao_liquidity(
        ctx: Context<InitializeDAOLiquidity>,
        lp_reserve_percentage: u8,
    ) -> Result<()> {
        require!(lp_reserve_percentage > 0 && lp_reserve_percentage <= 20, ErrorCode::InvalidOperation);
        
        let dao_liq = &mut ctx.accounts.dao_liquidity;
        dao_liq.migration = ctx.accounts.migration.key();
        dao_liq.dao_treasury = ctx.accounts.admin.key();
        dao_liq.lp_percentage = lp_reserve_percentage;
        dao_liq.pool_initialized = false;
        dao_liq.total_reserved = 0;
        dao_liq.bump = ctx.bumps.dao_liquidity;
        
        msg!("DAO liquidity pool initialized with {}% reserve requirement", lp_reserve_percentage);
        Ok(())
    }

    /// Contribute tokens to the DAO-controlled liquidity pool
    pub fn contribute_to_dao_lp(
        ctx: Context<ContributeDAOLiquidity>,
        amount: u64,
    ) -> Result<()> {
        require!(amount > 0, ErrorCode::InvalidAmount);
        
        let dao_liq = &mut ctx.accounts.dao_liquidity;
        require!(dao_liq.migration == ctx.accounts.migration.key(), ErrorCode::InvalidOperation);
        
        // Transfer tokens to DAO treasury
        let token_program = &ctx.accounts.token_program;
        let cpi_accounts = anchor_spl::token_interface::TransferChecked {
            from: ctx.accounts.user_token_account.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.dao_vault.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };

        anchor_spl::token_interface::transfer_checked(
            CpiContext::new(token_program.to_account_info(), cpi_accounts),
            amount,
            ctx.accounts.mint.decimals,
        )?;

        dao_liq.total_reserved = dao_liq.total_reserved.checked_add(amount)
            .ok_or(ErrorCode::InvalidOperation)?;

        msg!("User {} contributed {} tokens to DAO LP pool", ctx.accounts.user.key(), amount);
        Ok(())
    }

#[derive(Accounts)]
#[instruction(name: [u8; 64], source_chain: u16, source_address: [u8; 32], snapshot_root: [u8; 32], total_supply: u64)]
pub struct InitializeMigration<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    
    #[account(
        init,
        payer = admin,
        space = 8 + size_of::<Migration>(),
        seeds = [b"migration", admin.key().as_ref(), &source_chain.to_le_bytes()],
        bump
    )]
    pub migration: Account<'info, Migration>,
    
    #[account(
        init,
        payer = admin,
        mint::decimals = 6,
        mint::authority = migration_authority,
    )]
    pub mint: InterfaceAccount<'info, Mint>,
    
    /// CHECK: The authority for the migration account
    #[account(
        seeds = [b"authority", migration.key().as_ref()],
        bump
    )]
    pub migration_authority: UncheckedAccount<'info>,
    
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(amount: u64, merkle_proof: Vec<[u8; 32]>, leaf_index: u32)]
pub struct ClaimTokens<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(mut)]
    pub migration: Account<'info, Migration>,
    
    #[account(
        init,
        payer = user,
        space = 8 + size_of::<UserClaim>(),
        seeds = [b"claim", migration.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub user_claim: Account<'info, UserClaim>,
    
    pub mint: InterfaceAccount<'info, Mint>,
    
    #[account(mut)]
    pub token_vault: InterfaceAccount<'info, TokenAccount>,
    
    #[account(mut)]
    pub user_token_account: InterfaceAccount<'info, TokenAccount>,
    
    /// CHECK: The authority for migrations
    pub migration_authority: UncheckedAccount<'info>,
    
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct FinalizeMigration<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    
    #[account(mut)]
    pub migration: Account<'info, Migration>,
}

#[derive(Accounts)]
pub struct InitializeDAOLiquidity<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    
    pub migration: Account<'info, Migration>,
    
    #[account(
        init,
        payer = admin,
        space = 8 + size_of::<DAOLiquidity>(),
        seeds = [b"dao_liquidity", migration.key().as_ref()],
        bump
    )]
    pub dao_liquidity: Account<'info, DAOLiquidity>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ContributeDAOLiquidity<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub migration: Account<'info, Migration>,
    
    #[account(mut)]
    pub dao_liquidity: Account<'info, DAOLiquidity>,
    
    pub mint: InterfaceAccount<'info, Mint>,
    
    #[account(mut)]
    pub user_token_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(mut)]
    pub dao_vault: InterfaceAccount<'info, TokenAccount>,
    
    pub token_program: Interface<'info, TokenInterface>,
}

#[account]
pub struct Migration {
    pub name: [u8; 64],         // 64 (fixed size)
    pub admin: Pubkey,          // 32
    pub source_chain: u16,      // 2
    pub source_address: [u8; 32], // 32 (fixed size)
    pub snapshot_root: [u8; 32], // 32
    pub total_supply: u64,      // 8
    pub migrated_amount: u64,   // 8
    pub is_active: bool,        // 1
    pub bump: u8,               // 1
}

#[account]
pub struct UserClaim {
    pub user: Pubkey,       // 32
    pub is_claimed: bool,   // 1
    pub amount: u64,        // 8
}

#[account]
pub struct Governance {
    pub migration: Pubkey,
    pub total_votes: u64,
}

#[account]
pub struct DAOLiquidity {
    pub migration: Pubkey,      // 32 - Reference to migration
    pub dao_treasury: Pubkey,   // 32 - DAO treasury address
    pub lp_percentage: u8,      // 1  - Percentage reserve (1-20%)
    pub pool_initialized: bool, // 1  - Whether LP was created
    pub total_reserved: u64,    // 8  - Total tokens in DAO LP
    pub bump: u8,               // 1  - PDA bump
}

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid operation")]
    InvalidOperation,
    #[msg("Migration is not active")]
    MigrationNotActive,
    #[msg("Invalid amount")]
    InvalidAmount,
    #[msg("User has already claimed")]
    AlreadyClaimed,
    #[msg("Invalid merkle proof")]
    InvalidMerkleProof,
    #[msg("Unauthorized")]
    Unauthorized,
}
