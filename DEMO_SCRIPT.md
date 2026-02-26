# NecroBridge Demo Video Script

## Video Overview
**Duration:** 4-5 minutes  
**Target Audience:** Solana Graveyard Hackathon Judges  
**Goal:** Showcase technical implementation, UX design, and real-world utility

---

## Scene 1: Hook & Introduction (30 seconds)

### Visual:
- Start with dramatic shot of the homepage
- Death Star icon animating, grid background visible
- Text overlay: "What if dead crypto protocols could rise again?"

### Script:
"Every year, billions of dollars in crypto assets become stranded on abandoned chains. NecroBridge is a community-driven resurrection platform that brings dead protocols back to life on Solana."

### Key Points:
- Problem: Dead protocols = lost value
- Solution: Trustless migration to Solana
- Unique angle: Community governance + Merkle proofs

---

## Scene 2: Homepage & Project Discovery (45 seconds)

### Visual:
- Scroll through homepage
- Show "Two Legal Paths to Resurrection" section
- Hover over project cards showing FTX, LUNA, Terra

### Script:
"NecroBridge offers two paths to resurrection. Path A - Official Revival through Sunrise DeFi for teams that want to coordinate. Path B - Community Fork for abandoned projects. Let's explore some nominated protocols."

### Actions:
1. Scroll to "Browse Projects" section
2. Click on a project card (e.g., "FTX Token Recovery")
3. Show project details page

### Technical Highlight:
- "Each project card shows real-time vote counts, chain origin, and migration status - all powered by Firestore real-time listeners."

---

## Scene 3: Wallet Connection (30 seconds)

### Visual:
- Click "Connect Wallet" button
- Show wallet selection modal (Phantom, Solflare, etc.)
- Connected state showing truncated address

### Script:
"NecroBridge uses Solana Wallet Adapter for seamless connection. Once connected, users can vote, claim tokens, and track their portfolio."

### Actions:
1. Click "Connect Wallet"
2. Select Phantom wallet
3. Show connected state with address display

---

## Scene 4: Voting System (60 seconds)

### Visual:
- Navigate to /projects
- Show voting interface
- Cast a vote with SOL amount
- Show real-time vote update

### Script:
"The voting system uses quadratic voting - your voting power is the square root of your SOL contribution. This prevents whale dominance and ensures fair governance."

### Actions:
1. Navigate to Projects page
2. Select a project to vote on
3. Enter vote amount (e.g., 0.5 SOL)
4. Submit vote
5. Show toast notification
6. Show updated vote count in real-time

### Technical Highlight:
- "Votes are stored in Firestore with real-time sync across all clients. The quadratic formula is calculated server-side to prevent manipulation."

---

## Scene 5: Nomination Flow (45 seconds)

### Visual:
- Navigate to /nominate
- Fill out nomination form
- Show success state with leaderboard position

### Script:
"Anyone can nominate a dead protocol. Just enter the project details, source chain, and token information. Once submitted, the community can start voting immediately."

### Actions:
1. Click "Nominate Project"
2. Fill form:
   - Project Name: "Example Dead Token"
   - Ticker: "DEAD"
   - Chain: Ethereum
   - Contract: 0x1234...
3. Submit nomination
4. Show success screen with leaderboard position

---

## Scene 6: Dashboard & Portfolio (60 seconds)

### Visual:
- Navigate to /dashboard
- Show Overview tab with stats
- Switch to Portfolio tab
- Show claimable balance table

### Script:
"The dashboard gives users complete visibility. Track your voting power, active votes, and most importantly - tokens ready to claim from successful migrations."

### Actions:
1. Navigate to Dashboard
2. Show Overview tab (platform stats)
3. Switch to Portfolio tab
4. Show:
   - Voting Power: 24.5
   - Active Votes: 3
   - Claimable: 2 projects
5. Show Claimable Balance Table
6. Click "Claim All" button

### Technical Highlight:
- "The dashboard is wallet-gated using Solana Wallet Adapter. Protected routes require authentication, while public data remains accessible to all."

---

## Scene 7: Token Claim Process (90 seconds)

### Visual:
- Navigate to Claim tab
- Enter original wallet address
- Show verification process
- Submit claim transaction
- Show success state

### Script:
"Here's where the magic happens. Original token holders can claim their Solana tokens using trustless Merkle proofs. Let me demonstrate:"

### Actions:
1. Navigate to Claim tab
2. Select a completed migration
3. Enter original wallet address (e.g., 0x1234...)
4. Click "Verify Address"
5. Show verification success with claimable amount
6. Click "Claim Tokens"
7. Show wallet approval prompt
8. Show transaction confirmation
9. Show success toast with transaction link

### Technical Highlight:
- "The claim process uses Anchor framework for Solana program interactions. Merkle proofs are generated client-side and verified on-chain, ensuring no central authority can manipulate claims."

---

## Scene 8: Leaderboard & Real-time Updates (45 seconds)

### Visual:
- Navigate to /leaderboard
- Show live vote updates
- Point out "Hot" tags and recent activity

### Script:
"The leaderboard shows real-time rankings with Hot tags for surging projects. Watch as votes come in live - this is powered by Firestore onSnapshot listeners."

### Actions:
1. Navigate to Leaderboard
2. Point out:
   - Live vote counts
   - Hot tags on trending projects
   - YES percentage bars
   - Recent activity timestamps
   - Most active chains section

---

## Scene 9: Documentation & Sunrise Integration (30 seconds)

### Visual:
- Navigate to /docs
- Show Sunrise DeFi section
- Click external link to sunrisedefi.com

### Script:
"NecroBridge integrates with Sunrise DeFi for official revivals. Teams can apply at Sunrise to get coordinated market formation, liquidity, and go-to-market support."

### Actions:
1. Navigate to Docs page
2. Show tabbed interface
3. Click "Migration Paths" tab
4. Show Sunrise DeFi information
5. Click external link

---

## Scene 10: Closing & Call to Action (30 seconds)

### Visual:
- Return to homepage
- Show all features in quick montage
- End with NecroBridge logo and tagline

### Script:
"NecroBridge: Resurrecting dead protocols on Solana. Community-powered. Trustless. Real value for stranded assets. Join the resurrection."

### Final Screen:
- GitHub: github.com/yourusername/necrobridge
- Live Demo: [your-netlify-url]
- Team: [Your Name/Hackathon Team]

---

## Technical Talking Points (For Voiceover)

### Architecture:
- "Frontend built with Next.js 16, React 19, and Tailwind CSS v4"
- "Real-time data sync using Firebase Firestore"
- "Solana program built with Anchor framework"
- "Merkle tree generation for trustless claims"

### Key Features:
- "Wallet-gated dashboard with protected routes"
- "Quadratic voting to prevent whale dominance"
- "Two-path migration: Official Revival vs Community Fork"
- "Sunrise DeFi integration for coordinated launches"

### Security:
- "Client-side Merkle proof generation"
- "On-chain verification via Anchor program"
- "No central authority in claim process"

---

## Recording Tips

### Software:
- **Screen Recording:** OBS Studio (free) or Loom
- **Video Editing:** DaVinci Resolve (free) or iMovie
- **Audio:** Clean voiceover with minimal background noise

### Best Practices:
1. **Smooth Cursor:** Use a visible cursor highlight
2. **Zoom In:** Zoom on small UI elements (wallet addresses, buttons)
3. **Transitions:** Use fade transitions between scenes
4. **Captions:** Add captions for accessibility
5. **Music:** Optional subtle background music (low volume)

### Timing:
- Keep each scene under 90 seconds
- Pause briefly after important actions
- Show loading states to demonstrate real-time functionality

---

## Post-Production Checklist

- [ ] Trim dead air and mistakes
- [ ] Add intro title card (3 seconds)
- [ ] Add outro with links (5 seconds)
- [ ] Export in 1080p resolution
- [ ] File size under 100MB for easy sharing
- [ ] Upload to YouTube (unlisted) or Loom
- [ ] Test audio levels on different devices

---

## Alternative: Live Demo Format

If presenting live instead of video:

1. **Setup:** Have 2 browsers ready (voter + claimant)
2. **Preparation:** Pre-nominate 2-3 projects
3. **Flow:**
   - Intro (1 min)
   - Nominate project (1 min)
   - Vote with Wallet A (1 min)
   - Show real-time update on Wallet B (30 sec)
   - Claim process (2 min)
   - Q&A (1-2 min)

**Total: 6-7 minutes**
