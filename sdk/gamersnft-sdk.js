/**
 * GamersNFT JavaScript SDK
 * Integrate NFT rewards into your game
 */

class GamersNFT {
  constructor(apiKey, baseUrl = 'http://localhost:3001') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.gameId = null;
  }

  async initialize() {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/games`);
      const data = await response.json();
      const game = data.games.find(g => g.api_key === this.apiKey);
      
      if (!game) {
        throw new Error('Invalid API key');
      }
      
      this.gameId = game.id;
      return { success: true, game };
    } catch (error) {
      throw new Error(`Failed to initialize: ${error.message}`);
    }
  }

  async mintReward(playerAccountId, templateId, customMetadata = {}) {
    if (!this.gameId) {
      throw new Error('SDK not initialized. Call initialize() first.');
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/v1/games/${this.gameId}/mint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: this.apiKey,
          playerAccountId,
          templateId,
          metadata: customMetadata
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Mint failed');
      }

      return {
        success: true,
        nftId: data.nftId,
        serialNumber: data.serialNumber,
        metadataCID: data.metadataCID
      };
    } catch (error) {
      throw new Error(`Failed to mint NFT: ${error.message}`);
    }
  }

  async getTemplates() {
    if (!this.gameId) {
      throw new Error('SDK not initialized. Call initialize() first.');
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/v1/games/${this.gameId}/templates`);
      const data = await response.json();
      return data.templates;
    } catch (error) {
      throw new Error(`Failed to fetch templates: ${error.message}`);
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = GamersNFT;
}

if (typeof window !== 'undefined') {
  window.GamersNFT = GamersNFT;
}
