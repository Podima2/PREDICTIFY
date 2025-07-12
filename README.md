# Predictify — The Football Prophet Chain

> *"The only place where your football predictions become immortal, monetized, and memed forever."*

## 🚀 TL;DR

**Predictify** is a decentralized prediction reel platform where fans submit scoreline or match predictions (text or video) **before kick-off**, and every **correct prediction extends their on-chain streak**.

Fans earn **$CHZ, tips, and reputation**. The longer the streak, the more visible and influential they become.

✅ Think: *"Wordle meets Twitter meets Fan Tokens"*

## 🎯 Problem Statement

- Football fans make predictions constantly but have no way to prove their expertise
- No monetization for accurate predictors
- Fan engagement drops between matches
- Bragging rights are temporary and not verifiable

## 💡 Solution

Predictify creates an **on-chain prediction ecosystem** where:
- Every prediction is immortalized as an NFT
- Correct predictions build verifiable streaks
- Top predictors earn $CHZ and fan token rewards
- Community can tip and follow the best prophets

## 🧩 Core Features

### 🔗 1. **Prediction Chain Reels**
- Submit predictions for upcoming matches (text or 30s video)
- Each prediction becomes a **Reel NFT** stored on-chain
- Correct predictions automatically link to form your **Prediction Chain**

### 💫 2. **On-Chain Streaks**
- Public "Prediction Chain" for each fan
- Example streak:
  - ✅ "Real 2-1 City"
  - ✅ "Barca win with Lewa goal" 
  - ✅ "Jude scores and gets MOTM"
  - 🔥 *3-streak, now trending in the $RMA club zone!*

### 🏆 3. **Prophet Leaderboard (Per Club)**
- Top predictors per club featured weekly
- Tiered badges:
  - 🟢 Rookie Prophet (3+ streak)
  - 🔵 Oracle of Derby Days (5+ streak)
  - 🔴 Football Whisperer (10+ streak)

### 💸 4. **Monetization**
- Tip predictors in **$CHZ or $TEAM tokens**
- Weekly reward pools for top predictors
- Club-sponsored streak prizes (tickets, merch)

### 👥 5. **Social Features**
- Follow top predictors
- Comment and react to predictions
- Duet/stitch wrong predictions for roasting

### 👑 6. **Prediction Clout NFTs**
- 5+ streak: Mint Prophet Badge NFT
- 10+ streak: Unlock SBT with voting perks

## 🔗 Fan Token Utility

| Token | Usage |
|-------|-------|
| `$CHZ` | Tipping, prize rewards |
| `$TEAM` | Gated prediction access for top games |
| `Fan SBT` | Perks, badges, boosted leaderboard status |

## 🧠 Why It's Viral

| Element | Effect |
|---------|--------|
| ⚔️ Streaks | Fans chase consistency + clout |
| 🎥 Video Format | TikTok-ready for sharing bold takes |
| 🧢 Ego + Fandom | "I called it!" bragging rights |
| 💬 Community | Predictors become club influencers |
| 🔁 FOMO | Users return every matchday |

## 🔧 Tech Stack

- **Blockchain**: Chiliz Chain
- **Smart Contracts**: Solidity (predictions, streaks, tipping)
- **Frontend**: Next.js, React, Tailwind CSS
- **Wallet Integration**: Privy Wallet 
- **Storage**: IPFS for video/text content
- **Oracle**: 

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │  Smart Contracts │    │   Data Layer    │
│                 │    │                  │    │                 │
│ • React App     │◄──►│ • PredictionNFT  │◄──►│ • IPFS Storage  │
│ • Wallet Connect│    │ • StreakManager  │    │ • Match Oracle  │
│ • Video Upload  │    │ • TippingSystem  │    │ • Metadata API  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 📱 User Journey

1. **Connect** Socios wallet
2. **Browse** upcoming matches
3. **Submit** prediction (text/video)
4. **Wait** for match result
5. **Celebrate** streak extension or start over
6. **Earn** tips and climb leaderboards

## 🎮 Sample Use Case

**@footballnerd** holds $PSG tokens:
- Predicts "Mbappé 2 goals + yellow card" vs Marseille
- Receives 100 tips in $PSG tokens
- Extends streak to 4 predictions
- Featured as "🔥 Prophet of the Week"
- Mints "Derby Oracle" badge NFT

## 🏆 Hackathon Fit

| Criteria | Strength |
|----------|----------|
| **Concept (20%)** | Fresh viral mechanic with streak-based content |
| **Technical (45%)** | Smart contracts, NFTs, tipping, oracle integration |
| **Engagement (35%)** | High retention through matchday traffic + social features |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MetaMask Wallet
- Chiliz testnet CHZ

### Installation

```bash
git clone https://github.com/Podima2/PREDICTIFY
cd PREDICTIFY
npm install
npm run dev
```

### Environment Variables

```env
NEXT_PUBLIC_CHILIZ_RPC_URL=https://spicy-rpc.chiliz.com
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_key
```

## 📋 Roadmap

- [x] Core prediction smart contracts
- [x] Basic UI for predictions
- [x] Streak tracking system
- [ ] Video upload integration
- [ ] Tipping mechanism
- [ ] Leaderboard system
- [ ] Mobile app

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md).

## 📄 License

MIT License - see [LICENSE](LICENSE) file.

## 🔗 Links

- [Live Demo]()
- [Pitch Deck]()
- [Smart Contracts]()
- [Devfolio Submission]()

---
