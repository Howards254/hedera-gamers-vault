# GamersNFT JavaScript SDK

Integrate NFT rewards into your game with just a few lines of code.

## Quick Start

```javascript
// Initialize SDK
const sdk = new GamersNFT('your_api_key_here');
await sdk.initialize();

// Mint NFT reward when player achieves something
await sdk.mintReward(
  '0.0.123456',           // Player's Hedera account ID
  'legendary_sword_001',  // Template ID
  { achievement: 'Defeated Dragon Boss' }
);
```

## API Reference

### `initialize()`
Initialize the SDK and validate API key.

### `mintReward(playerAccountId, templateId, customMetadata)`
Mint an NFT reward to a player.

### `getTemplates()`
Get all NFT templates for your game.

## Examples

### Phaser (JavaScript)
```javascript
class GameScene extends Phaser.Scene {
    async create() {
        this.nftSDK = new GamersNFT('your_api_key');
        await this.nftSDK.initialize();
    }

    async onBossDefeated() {
        await this.nftSDK.mintReward(
            playerAccount,
            'legendary_sword_001',
            { bossName: 'Dragon King' }
        );
    }
}
```
