# Dynamic Minting Guide

## Overview

Dynamic minting allows you to mint NFTs on-the-fly without creating templates first. Perfect for unique loot, procedurally generated items, and one-of-a-kind collectibles.

## When to Use

### Template System (Predefined Items)
- Achievement badges
- Standard player cards
- Season rewards
- Items that many players will receive

### Dynamic System (Unique Items)
- Raid loot with random stats
- Procedurally generated items
- Player-crafted items
- Tournament rewards
- Special event commemoratives

## API Endpoint

### POST `/api/v1/games/:gameId/mint-dynamic`

**Required Fields:**
- `apiKey` - Your game's API key
- `playerAccountId` - Hedera account ID (0.0.xxx)
- `name` - NFT name
- `description` - NFT description
- `imageUrl` - Image URL (must be publicly accessible)

**Optional Fields:**
- `type` - Item type/category (e.g., "Weapon", "Armor")
- `rarity` - Rarity level (e.g., "Legendary", "Epic")
- `attributes` - Custom JSON object with any properties

## SDK Usage

### JavaScript/Node.js

```javascript
const GamersNFT = require('./gamersnft-sdk.js');

const gamersNFT = new GamersNFT('your_api_key');
await gamersNFT.initialize();

// Mint unique loot
const result = await gamersNFT.mintDynamic(playerAccountId, {
  name: "Flaming Dragon Sword +15",
  description: "Legendary sword found in Dragon's Lair raid",
  imageUrl: "https://yourgame.com/items/dragon-sword-fire.png",
  type: "Weapon",
  rarity: "Legendary",
  attributes: {
    damage: 150,
    fireDamage: 50,
    durability: 100,
    enchantment: "Fire",
    foundIn: "Dragon's Lair - Level 50",
    foundDate: new Date().toISOString()
  }
});

console.log('NFT Minted:', result.nftId);
```

### Browser/HTML

```html
<script src="gamersnft-sdk.js"></script>
<script>
const gamersNFT = new GamersNFT('your_api_key');

async function rewardPlayer(playerAccount, lootData) {
  await gamersNFT.initialize();
  
  const nft = await gamersNFT.mintDynamic(playerAccount, {
    name: lootData.name,
    description: lootData.description,
    imageUrl: lootData.imageUrl,
    type: lootData.type,
    rarity: lootData.rarity,
    attributes: lootData.stats
  });
  
  console.log('Reward minted:', nft);
}
</script>
```

## Real-World Examples

### Example 1: Arena Breakout (Raid Loot)

```javascript
// Player completes raid
function onRaidComplete(playerAccountId) {
  const loot = generateRandomLoot(); // Your loot system
  
  gamersNFT.mintDynamic(playerAccountId, {
    name: `${loot.weaponName} +${loot.level}`,
    description: `Found in ${loot.location}. ${loot.specialEffect}`,
    imageUrl: `https://arena.com/weapons/${loot.weaponId}.png`,
    type: "Assault Rifle",
    rarity: loot.rarity,
    attributes: {
      damage: loot.damage,
      fireRate: loot.fireRate,
      accuracy: loot.accuracy,
      attachments: loot.attachments,
      condition: 100,
      raidLocation: loot.location,
      timestamp: Date.now()
    }
  });
}
```

### Example 2: FC Mobile (Special Moment Card)

```javascript
// Player wins tournament
function awardTournamentCard(winnerAccountId, tournamentData) {
  gamersNFT.mintDynamic(winnerAccountId, {
    name: "Messi - Tournament Champion Edition",
    description: `Exclusive card for ${tournamentData.name} Winner`,
    imageUrl: "https://fcmobile.com/cards/messi-champion.png",
    type: "Tournament Reward",
    rarity: "Mythic",
    attributes: {
      overall: 98,
      tournament: tournamentData.name,
      winner: tournamentData.winnerName,
      date: tournamentData.date,
      prize: tournamentData.prize,
      edition: "1 of 1"
    }
  });
}
```

### Example 3: Diablo-Style (Random Loot)

```javascript
// Boss drops random item
function onBossKill(playerAccountId, bossName) {
  const item = {
    name: generateItemName(),
    stats: generateRandomStats(),
    affixes: generateRandomAffixes()
  };
  
  gamersNFT.mintDynamic(playerAccountId, {
    name: item.name,
    description: `Dropped by ${bossName}. ${item.affixes.join(', ')}`,
    imageUrl: `https://game.com/items/${item.type}.png`,
    type: item.type,
    rarity: item.rarity,
    attributes: {
      ...item.stats,
      affixes: item.affixes,
      droppedBy: bossName,
      droppedAt: new Date().toISOString(),
      itemLevel: item.level
    }
  });
}
```

### Example 4: Crafting System

```javascript
// Player crafts unique item
function onItemCrafted(playerAccountId, recipe, materials) {
  const craftedItem = combineRecipe(recipe, materials);
  
  gamersNFT.mintDynamic(playerAccountId, {
    name: craftedItem.name,
    description: `Crafted by ${playerAccountId} using ${materials.join(', ')}`,
    imageUrl: craftedItem.imageUrl,
    type: "Crafted Item",
    rarity: craftedItem.rarity,
    attributes: {
      ...craftedItem.stats,
      craftedBy: playerAccountId,
      craftedAt: Date.now(),
      recipe: recipe.name,
      materials: materials,
      quality: craftedItem.quality
    }
  });
}
```

## Response Format

```json
{
  "success": true,
  "nftId": 123,
  "serialNumber": 5,
  "metadataCID": "QmX...",
  "metadata": {
    "name": "Flaming Dragon Sword +15",
    "description": "Legendary sword found in Dragon's Lair raid",
    "image": "https://yourgame.com/items/dragon-sword-fire.png",
    "type": "Legendary",
    "creator": "Your Game Name",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "attributes": {
      "damage": 150,
      "fireDamage": 50,
      "durability": 100
    }
  }
}
```

## Best Practices

### Image URLs
- Use HTTPS
- Ensure images are publicly accessible
- Recommended size: 512x512 or 1024x1024
- Supported formats: PNG, JPG, GIF, WebP

### Attributes
- Keep attribute names consistent
- Use meaningful keys
- Include timestamp for unique items
- Add context (where found, when dropped, etc.)

### Naming
- Make names descriptive
- Include level/tier if applicable
- Add unique identifiers for special items

### Error Handling
```javascript
try {
  const nft = await gamersNFT.mintDynamic(playerAccountId, nftDetails);
  console.log('Success:', nft);
} catch (error) {
  console.error('Mint failed:', error.message);
  // Handle error (retry, notify player, etc.)
}
```

## Comparison: Template vs Dynamic

### Template Minting
```javascript
// Setup once
createTemplate("legendary_sword", {...});

// Mint many times (simple)
gamersNFT.mintReward(player, "legendary_sword");
```

### Dynamic Minting
```javascript
// No setup needed

// Mint with full details (flexible)
gamersNFT.mintDynamic(player, {
  name: "Unique Sword",
  description: "...",
  imageUrl: "...",
  attributes: {...}
});
```

## Cost Considerations

- **Template**: Lower cost per mint (reuses metadata)
- **Dynamic**: Slightly higher cost (new IPFS upload per item)
- Both cost ~$0.001 per mint on Hedera

## Support

For issues or questions:
- Check documentation: `/docs` in the platform
- GitHub Issues
- Discord community

## Next Steps

1. Get your API key from Developer Dashboard
2. Install SDK: Copy `gamersnft-sdk.js` to your project
3. Initialize SDK with your API key
4. Start minting dynamic NFTs!
