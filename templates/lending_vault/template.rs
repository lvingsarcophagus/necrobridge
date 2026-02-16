// Lending Vault Template for NecroBridge
// 
// Simple lending vault: deposit collateral, borrow against it
// Customize as needed for your protocol

use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount};

declare_id!("lend0000000000000000000000000000000000000000");

#[program]
pub mod lending_vault {
    use super::*;

    pub fn initialize_vault(ctx: Context<InitializeVault>) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.total_collateral = 0;
        vault.total_borrowed = 0;
        vault.ltv_ratio = 7500; // 75% LTV
        Ok(())
    }

    pub fn deposit_collateral(
        ctx: Context<DepositCollateral>,
        amount: u64,
    ) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        user_account.collateral = amount;
        user_account.user = ctx.accounts.user.key();

        let vault = &mut ctx.accounts.vault;
        vault.total_collateral += amount;

        Ok(())
    }

    pub fn borrow(ctx: Context<Borrow>, amount: u64) -> Result<()> {
        let user_account = &ctx.accounts.user_account;
        let max_borrow = (user_account.collateral * ctx.accounts.vault.ltv_ratio) / 10000;

        require!(amount <= max_borrow, LendingError::ExceedsLTV);

        // TODO: Transfer borrowed tokens to user
        let vault = &mut ctx.accounts.vault;
        vault.total_borrowed += amount;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeVault<'info> {
    pub authority: Signer<'info>,
    #[account(init, payer = authority, space = 200)]
    pub vault: Account<'info, Vault>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DepositCollateral<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub user_account: Account<'info, UserAccount>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Borrow<'info> {
    pub user: Signer<'info>,
    pub user_account: Account<'info, UserAccount>,
    pub vault: Account<'info, Vault>,
}

#[account]
pub struct Vault {
    pub total_collateral: u64,
    pub total_borrowed: u64,
    pub ltv_ratio: u64, // e.g., 7500 = 75%
}

#[account]
pub struct UserAccount {
    pub user: Pubkey,
    pub collateral: u64,
    pub borrowed: u64,
}

#[error_code]
pub enum LendingError {
    #[msg("Borrow amount exceeds LTV")]
    ExceedsLTV,
}
