/**
 * Script to add ZOMB token nomination and votes to NecroBridge
 * Usage: node scripts/add-zomb-votes.js
 */

const API_BASE = 'http://localhost:3000';

// ZOMB token details
const ZOMB_TOKEN = {
  name: 'Zombie Token',
  ticker: 'ZOMB',
  sourceChain: 'Sepolia',
  contractAddress: '0x5ef2539ae4555FeC2e6831485097b78d15Fa5e4d',
  reason: 'Trustless ERC-20 to Solana migration testing on NecroBridge. 1M supply token deployed for end-to-end flow validation.',
  website: 'https://necrobridge.xyz',
};

// Test wallet addresses for voting (simulating different voters)
const TEST_WALLETS = [
  'DummyWallet1111111111111111111111111111111',
  'DummyWallet2222222222222222222222222222222',
  'DummyWallet3333333333333333333333333333333',
  'DummyWallet4444444444444444444444444444444',
  'DummyWallet5555555555555555555555555555555',
  'DummyWallet6666666666666666666666666666666',
  'DummyWallet7777777777777777777777777777777',
  'DummyWallet8888888888888888888888888888888',
  'DummyWallet9999999999999999999999999999999',
  'DummyWalletAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
];

// Dummy transaction signatures (valid base58 format)
const DUMMY_SIGS = [
  '1111111111111111111111111111111111111111111111111111111111111111111111111111111',
  '2222222222222222222222222222222222222222222222222222222222222222222222222222222',
  '3333333333333333333333333333333333333333333333333333333333333333333333333333333',
  '4444444444444444444444444444444444444444444444444444444444444444444444444444444',
  '5555555555555555555555555555555555555555555555555555555555555555555555555555555',
  '6666666666666666666666666666666666666666666666666666666666666666666666666666666',
  '7777777777777777777777777777777777777777777777777777777777777777777777777777777',
  '8888888888888888888888888888888888888888888888888888888888888888888888888888888',
  '9999999999999999999999999999999999999999999999999999999999999999999999999999999',
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
];

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function nominateZomb() {
  console.log('📋 Nominating ZOMB token...\n');
  
  try {
    const response = await fetch(`${API_BASE}/api/nominations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        walletAddress: TEST_WALLETS[0],
        projectName: ZOMB_TOKEN.name,
        ticker: ZOMB_TOKEN.ticker,
        sourceChain: ZOMB_TOKEN.sourceChain,
        contractAddress: ZOMB_TOKEN.contractAddress,
        reason: ZOMB_TOKEN.reason,
        website: ZOMB_TOKEN.website,
        transactionSignature: DUMMY_SIGS[0],
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Nomination failed:', error);
      return null;
    }

    const data = await response.json();
    console.log('✅ Nomination successful!');
    console.log(`   ID: ${data.nominationId}`);
    console.log(`   Ticker: ${ZOMB_TOKEN.ticker}`);
    console.log(`   Network: ${ZOMB_TOKEN.sourceChain}`);
    console.log(`   Contract: ${ZOMB_TOKEN.contractAddress}\n`);
    
    return data.nominationId;
  } catch (error) {
    console.error('❌ Error nominating ZOMB:', error.message);
    return null;
  }
}

async function addVotes(nominationId) {
  console.log(`✨ Adding votes to bring ZOMB to 100% approval...\n`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < TEST_WALLETS.length; i++) {
    try {
      console.log(`\n📝 Vote ${i + 1}/${TEST_WALLETS.length}...`);

      const response = await fetch(`${API_BASE}/api/votes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: TEST_WALLETS[i],
          projectId: nominationId,
          direction: 'yes', // voting YES to approve
          power: 10, // 10% voting power per wallet
          transactionSignature: DUMMY_SIGS[i],
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error(`   ❌ Failed: ${error.message}`);
        failCount++;
      } else {
        const data = await response.json();
        console.log(`   ✅ Vote recorded`);
        console.log(`      Wallet: ${TEST_WALLETS[i].substring(0, 20)}...`);
        console.log(`      Power: 10%`);
        console.log(`      Total so far: ${(successCount + 1) * 10}%`);
        successCount++;
      }

      // Small delay between requests
      await sleep(100);
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
      failCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 VOTING SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Successful votes: ${successCount}`);
  console.log(`❌ Failed votes: ${failCount}`);
  console.log(`📈 Total approval: ${successCount * 10}%`);
  console.log('='.repeat(50) + '\n');

  return successCount >= 10; // Need 100% (10 votes × 10% each)
}

async function verifyApproval(nominationId) {
  console.log('🔍 Verifying approval status...\n');

  try {
    const response = await fetch(`${API_BASE}/api/votes?nominationId=${nominationId}`);
    
    if (!response.ok) {
      console.error('⚠️  Could not verify approval status');
      return;
    }

    const data = await response.json();
    console.log('✅ Current Votes for ZOMB:');
    console.log(`   Yes votes: ${data.yesVotes}`);
    console.log(`   No votes: ${data.noVotes}`);
    console.log(`   Total power: ${data.totalPower}%`);
    console.log(`   Status: ${data.status === 'approved' ? '✅ APPROVED (100%)' : '⏳ Pending (' + data.totalPower + '%)'}\n`);
  } catch (error) {
    console.error('⚠️  Error verifying approval:', error.message);
  }
}

async function main() {
  console.log('\n🧟 NecroBridge ZOMB Voting Script');
  console.log('='.repeat(50) + '\n');
  console.log('Action: Nominate ZOMB token and add 100% approval votes');
  console.log(`Token: ${ZOMB_TOKEN.name} (${ZOMB_TOKEN.ticker})`);
  console.log(`Network: ${ZOMB_TOKEN.sourceChain}`);
  console.log(`Contract: ${ZOMB_TOKEN.contractAddress}`);
  console.log(`API: ${API_BASE}\n`);

  try {
    // Step 1: Nominate ZOMB
    const nominationId = await nominateZomb();
    if (!nominationId) {
      console.error('Failed to nominate ZOMB. Exiting.');
      process.exit(1);
    }

    // Step 2: Add votes
    await sleep(500);
    const isApproved = await addVotes(nominationId);

    // Step 3: Verify
    await sleep(500);
    await verifyApproval(nominationId);

    if (isApproved) {
      console.log('🎉 SUCCESS! ZOMB token is ready for migration snapshot generation!\n');
      console.log('Next steps:');
      console.log('1. Go to http://localhost:3000/nominate');
      console.log('2. Find ZOMB token (should show 100% approved)');
      console.log('3. Click "Generate Snapshot"');
      console.log('4. Test on-chain claims with Solana wallet\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
