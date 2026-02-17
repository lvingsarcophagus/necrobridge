import { ethers } from 'ethers';

// ZOMB Token on Sepolia
export const ZOMB_CONTRACT = '0x5ef2539ae4555FeC2e6831485097b78d15Fa5e4d';
export const SEPOLIA_RPC = 'https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eac4d1d40a';

// Simple ERC20 ABI (only what we need)
export const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' },
    ],
    name: 'Transfer',
    type: 'event',
  },
];

/**
 * Get ZOMB balance for an Ethereum address on Sepolia
 */
export async function getZombBalance(ethAddress: string): Promise<string> {
  try {
    if (!ethers.isAddress(ethAddress)) {
      throw new Error('Invalid Ethereum address');
    }

    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
    const contract = new ethers.Contract(ZOMB_CONTRACT, ERC20_ABI, provider);

    const balance = await contract.balanceOf(ethAddress);
    console.log(`✅ ZOMB Balance for ${ethAddress}:`, balance.toString());
    return balance.toString();
  } catch (error) {
    console.error('❌ Error fetching ZOMB balance:', error);
    throw error;
  }
}

/**
 * Get all ZOMB holders from Sepolia by querying Transfer events
 * This is a simplified version - in production, use TheGraph or similar
 */
export async function getZombHolders(): Promise<
  Array<{ address: string; balance: string }>
> {
  try {
    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
    const contract = new ethers.Contract(ZOMB_CONTRACT, ERC20_ABI, provider);

    // Get the latest block
    const currentBlock = await provider.getBlockNumber();
    const fromBlock = Math.max(0, currentBlock - 10000); // Last 10k blocks

    console.log(`🔍 Querying ZOMB transfers from block ${fromBlock} to ${currentBlock}`);

    // Get all Transfer events
    const transferEvents = await contract.queryFilter(
      contract.filters.Transfer(),
      fromBlock,
      currentBlock
    );

    // Track token balances
    const balances: { [address: string]: bigint } = {};

    for (const event of transferEvents) {
      // @ts-ignore - ethers.js quirk with EventLog typing
      if (event.args && event.args.length >= 3) {
        // @ts-ignore
        const [from, to, value] = event.args;
        const fromAddr = from.toLowerCase();
        const toAddr = to.toLowerCase();
        const amount = BigInt(value.toString());

        // Update sender balance
        if (fromAddr !== ethers.ZeroAddress) {
          balances[fromAddr] = (balances[fromAddr] || BigInt(0)) - amount;
        }

        // Update receiver balance
        if (toAddr !== ethers.ZeroAddress) {
          balances[toAddr] = (balances[toAddr] || BigInt(0)) + amount;
        }
      }
    }

    // Filter to only positive balances (actual holders) and exclude zero address
    const holders = Object.entries(balances)
      .filter(([addr, balance]) => {
        return (
          balance > BigInt(0) &&
          addr.toLowerCase() !== ethers.ZeroAddress.toLowerCase()
        );
      })
      .map(([address, balance]) => ({
        address: address.toLowerCase(),
        balance: balance.toString(),
      }));

    console.log(`✅ Found ${holders.length} ZOMB holders`);
    return holders;
  } catch (error) {
    console.error('❌ Error fetching ZOMB holders:', error);
    throw error;
  }
}

/**
 * Format balance with decimals
 */
export function formatZombBalance(balanceString: string, decimals: number = 18): string {
  try {
    const balance = BigInt(balanceString);
    const divisor = BigInt(10) ** BigInt(decimals);
    const human = balance / divisor;
    return human.toString();
  } catch {
    return '0';
  }
}

/**
 * Convert to smallest unit
 */
export function parseZombAmount(humanAmount: string, decimals: number = 18): string {
  try {
    const amount = parseFloat(humanAmount);
    const multiplier = Math.pow(10, decimals);
    const wei = Math.floor(amount * multiplier).toString();
    return wei;
  } catch {
    return '0';
  }
}
