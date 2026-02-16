use anchor_lang::prelude::*;

#[account]
pub struct Migration {
    pub name: String,
    pub admin: Pubkey,
}

#[account]
pub struct UserClaim {
    pub user: Pubkey,
}

#[account]
pub struct Governance {
    pub migration: Pubkey,
}
