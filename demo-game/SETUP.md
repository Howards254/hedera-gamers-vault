# Dragon Slayer Demo Game - Setup Guide

## Quick Start

### 1. Register Your Game
1. Go to `http://localhost:8080/developers`
2. Connect your wallet
3. Click "Register Game"
4. Fill in:
   - **Name**: Dragon Slayer
   - **Description**: A clicker game where players defeat dragons and earn NFT rewards
   - **Logo URL**: https://via.placeholder.com/150
   - **Website URL**: http://localhost:8080
5. Copy your **API Key** (starts with `gn_`)

### 2. Create NFT Templates
Click "View Templates" for Dragon Slayer, then create these:

**Bronze Sword**
- Template ID: `bronze_sword`
- Name: Bronze Sword
- Description: First dragon defeated!
- Image URL: https://via.placeholder.com/300
- Rarity: Common

**Silver Sword**
- Template ID: `silver_sword`
- Name: Silver Sword
- Description: 10 dragons defeated!
- Image URL: https://via.placeholder.com/300
- Rarity: Rare

**Golden Sword**
- Template ID: `golden_sword`
- Name: Golden Sword
- Description: 50 dragons defeated!
- Image URL: https://via.placeholder.com/300
- Rarity: Legendary

### 3. Configure Game
1. Open `demo-game/index.html`
2. Line 145: Replace `YOUR_API_KEY_HERE` with your API key
3. Save file

### 4. Play
1. Open `demo-game/index.html` in browser
2. Enter your Hedera account ID
3. Click dragon to attack!

## Rewards
- 1 dragon → Bronze Sword NFT
- 10 dragons → Silver Sword NFT
- 50 dragons → Golden Sword NFT
