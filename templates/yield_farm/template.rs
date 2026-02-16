// Yield Farm Template for NecroBridge
// 
// This is a starter template for resurrecting a yield farming protocol on Solana
// Use as a base and customize for your specific farming mechanics

use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount, Mint, Transfer, transfer};

declare_id!("yarm0000000000000000000000000000000000000000");

#[program]
pub mod yield_farm {
    use super::*;

    /// Initialize a farming pool
    pub fn initialize_pool(
        ctx: Context<InitializePool>,
        reward_per_day: u64,
        lock_period_days: u64,
    ) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        pool.reward_mint = ctx.accounts.reward_mint.key();
        pool.reward_per_day = reward_per_day;
        pool.lock_period_days = lock_period_days;
        pool.total_staked = 0;
        pool.last_update = Clock::get()?.unix_timestamp;
        Ok(())
    }

    /// Deposit tokens to farm
    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_token.to_account_info(),
            to: ctx.accounts.pool_vault.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        transfer(CpiContext::new(cpi_program, cpi_accounts), amount)?;

        let farm = &mut ctx.accounts.farm;
        farm.amount_staked = amount;
        farm.staked_at = Clock::get()?.unix_timestamp;

        let pool = &mut ctx.accounts.pool;
        pool.total_staked += amount;

        Ok(())
    }

    /// Claim rewards
    pub fn claim_rewards(ctx: Context<ClaimRewards>) -> Result<()> {
        let farm = &ctx.accounts.farm;
        let pool = &ctx.accounts.pool;
        let now = Clock::get()?.unix_timestamp;

        let days_staked =
            ((now - farm.staked_at) / 86400) as u64;
        let rewards = days_staked
            .checked_mul(pool.reward_per_day)
            .unwrap()
            .checked_mul(farm.amount_staked)
            .unwrap()
            / pool.total_staked;

        // TODO: Mint rewards to user

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializePool<'info> {
    pub authority: Signer<'info>,
    #[account(mut)]
    pub reward_mint: Account<'info, Mint>,
    #[account(init, payer = authority, space = 200)]
    pub pool: Account<'info, Pool>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub user_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub pool_vault: Account<'info, TokenAccount>,
    #[account(mut)]
    pub farm: Account<'info, Farm>,
    #[account(mut)]
    pub pool: Account<'info, Pool>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct ClaimRewards<'info> {
    pub user: Signer<'info>,
    pub farm: Account<'info, Farm>,
    pub pool: Account<'info, Pool>,
}

#[account]
pub struct Pool {
    pub reward_mint: Pubkey,
    pub reward_per_day: u64,
    pub lock_period_days: u64,
    pub total_staked: u64,
    pub last_update: i64,
}

#[account]
pub struct Farm {
    pub user: Pubkey,
    pub amount_staked: u64,
    pub staked_at: i64,
}
