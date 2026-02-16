use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct InitializeMigration<'info> {
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimTokens<'info> {
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeGovernance<'info> {
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Vote<'info> {
    pub voter: Signer<'info>,
    pub system_program: Program<'info, System>,
}
