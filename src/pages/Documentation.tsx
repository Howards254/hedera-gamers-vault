import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Book, Code, Rocket, Copy, Check, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Documentation = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState('');

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
    toast({ title: 'Copied to clipboard!' });
  };

  const CodeBlock = ({ code, language = 'javascript', id }: any) => (
    <div className="relative">
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
        <code className={`language-${language}`}>{code}</code>
      </pre>
      <Button
        size="sm"
        variant="ghost"
        className="absolute top-2 right-2"
        onClick={() => copyCode(code, id)}
      >
        {copied === id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Book className="h-10 w-10 text-primary" />
              Developer Documentation
            </h1>
            <p className="text-muted-foreground text-lg">
              Everything you need to integrate NFT rewards into your game
            </p>
          </div>

          <Tabs defaultValue="quickstart" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
              <TabsTrigger value="sdk">SDK Reference</TabsTrigger>
              <TabsTrigger value="api">REST API</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
            </TabsList>

            <TabsContent value="quickstart" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="h-5 w-5 text-primary" />
                    Get Started in 5 Minutes
                  </CardTitle>
                  <CardDescription>Follow these steps to integrate NFT rewards</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Step 1: Register Your Game</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Go to the Developer Dashboard and register your game. You'll receive an API key instantly.
                    </p>
                    <Button asChild>
                      <a href="/developers">Developer Dashboard</a>
                    </Button>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Step 2: Create NFT Templates</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Define the NFT rewards your game will mint (e.g., "Legendary Sword", "Golden Shield").
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Step 3: Install SDK</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Download and include the SDK in your game:
                    </p>
                    <CodeBlock
                      id="install"
                      code={`<!-- Include in your HTML -->
<script src="https://your-domain.com/gamersnft-sdk.js"></script>

<!-- Or use npm -->
npm install gamersnft-sdk`}
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Step 4: Initialize SDK</h3>
                    <CodeBlock
                      id="init"
                      code={`const sdk = new GamersNFT('your_api_key_here');
await sdk.initialize();`}
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Step 5: Mint Rewards</h3>
                    <CodeBlock
                      id="mint"
                      code={`// When player achieves something
await sdk.mintReward(
  '0.0.123456',          // Player's Hedera account
  'legendary_sword',     // Template ID
  { level: 50 }          // Custom metadata
);`}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sdk" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>JavaScript SDK Reference</CardTitle>
                  <CardDescription>Complete API documentation for the GamersNFT SDK</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Constructor</h3>
                    <CodeBlock
                      id="constructor"
                      code={`new GamersNFT(apiKey, baseUrl?)

// Parameters:
// - apiKey: Your game's API key (required)
// - baseUrl: API endpoint (optional, defaults to production)`}
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">initialize()</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Validates API key and fetches game configuration. Must be called before other methods.
                    </p>
                    <CodeBlock
                      id="initialize"
                      code={`await sdk.initialize();

// Returns:
// { success: true, game: { id, name, ... } }`}
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">mintReward(playerAccountId, templateId, customMetadata)</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Mints an NFT reward to a player's Hedera account.
                    </p>
                    <CodeBlock
                      id="mintReward"
                      code={`await sdk.mintReward(
  '0.0.123456',              // Player's Hedera account ID
  'legendary_sword',         // Template ID from dashboard
  { achievement: 'Boss' }    // Optional custom metadata
);

// Returns:
// {
//   success: true,
//   nftId: 123,
//   serialNumber: 1,
//   metadataCID: 'Qm...'
// }`}
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">getTemplates()</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Fetches all NFT templates for your game.
                    </p>
                    <CodeBlock
                      id="getTemplates"
                      code={`const templates = await sdk.getTemplates();

// Returns array:
// [
//   {
//     template_id: 'legendary_sword',
//     name: 'Legendary Sword',
//     rarity: 'Legendary',
//     ...
//   }
// ]`}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>REST API Endpoints</CardTitle>
                  <CardDescription>Direct HTTP API for advanced integrations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">POST /api/v1/games/register</h3>
                    <p className="text-sm text-muted-foreground mb-3">Register a new game</p>
                    <CodeBlock
                      id="register"
                      code={`POST /api/v1/games/register
Content-Type: application/json

{
  "name": "My Game",
  "description": "Game description",
  "developerAccountId": "0.0.123456",
  "royaltyPercentage": 5,
  "logoUrl": "https://...",
  "websiteUrl": "https://..."
}

// Response:
{
  "success": true,
  "gameId": 1,
  "apiKey": "gn_..."
}`}
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">POST /api/v1/games/:gameId/templates</h3>
                    <p className="text-sm text-muted-foreground mb-3">Create NFT template</p>
                    <CodeBlock
                      id="template"
                      code={`POST /api/v1/games/1/templates
Content-Type: application/json

{
  "apiKey": "gn_...",
  "name": "Legendary Sword",
  "description": "A powerful sword",
  "imageUrl": "https://...",
  "type": "Weapon",
  "rarity": "Legendary",
  "attributes": { "damage": 100 }
}`}
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">POST /api/v1/games/:gameId/mint</h3>
                    <p className="text-sm text-muted-foreground mb-3">Mint NFT to player</p>
                    <CodeBlock
                      id="mintApi"
                      code={`POST /api/v1/games/1/mint
Content-Type: application/json

{
  "apiKey": "gn_...",
  "playerAccountId": "0.0.123456",
  "templateId": "legendary_sword",
  "metadata": { "level": 50 }
}

// Response:
{
  "success": true,
  "nftId": 123,
  "serialNumber": 1,
  "metadataCID": "Qm..."
}`}
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">GET /api/v1/games/:gameId/templates</h3>
                    <p className="text-sm text-muted-foreground mb-3">List all templates</p>
                    <CodeBlock
                      id="listTemplates"
                      code={`GET /api/v1/games/1/templates

// Response:
{
  "templates": [...]
}`}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="examples" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Integration Examples</CardTitle>
                  <CardDescription>Real-world examples for popular game engines</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Phaser 3 (JavaScript)</h3>
                    <CodeBlock
                      id="phaser"
                      code={`class GameScene extends Phaser.Scene {
  async create() {
    // Initialize SDK
    this.nftSDK = new GamersNFT('your_api_key');
    await this.nftSDK.initialize();
  }

  async onBossDefeated() {
    // Mint reward when boss defeated
    try {
      await this.nftSDK.mintReward(
        this.playerAccount,
        'legendary_sword',
        { bossName: 'Dragon King', time: Date.now() }
      );
      this.showRewardNotification('Legendary Sword earned!');
    } catch (error) {
      console.error('Failed to mint NFT:', error);
    }
  }
}`}
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Unity (C# via REST API)</h3>
                    <CodeBlock
                      id="unity"
                      language="csharp"
                      code={`using UnityEngine;
using UnityEngine.Networking;
using System.Collections;

public class NFTRewardManager : MonoBehaviour {
    private string apiKey = "your_api_key";
    private string baseUrl = "http://localhost:3001";

    public IEnumerator MintReward(string playerAccount, string templateId) {
        var data = new {
            apiKey = apiKey,
            playerAccountId = playerAccount,
            templateId = templateId,
            metadata = new { achievement = "Boss Defeated" }
        };

        string json = JsonUtility.ToJson(data);
        
        using (UnityWebRequest request = UnityWebRequest.Post(
            $"{baseUrl}/api/v1/games/1/mint", json, "application/json")) {
            
            yield return request.SendWebRequest();
            
            if (request.result == UnityWebRequest.Result.Success) {
                Debug.Log("NFT minted successfully!");
            }
        }
    }
}`}
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Node.js Backend</h3>
                    <CodeBlock
                      id="nodejs"
                      code={`const GamersNFT = require('gamersnft-sdk');

const sdk = new GamersNFT('your_api_key');
await sdk.initialize();

// Mint reward via backend
app.post('/player/achievement', async (req, res) => {
  const { playerAccount, achievementType } = req.body;
  
  const templateMap = {
    'boss_defeated': 'legendary_sword',
    'level_50': 'golden_shield'
  };
  
  try {
    const result = await sdk.mintReward(
      playerAccount,
      templateMap[achievementType],
      { timestamp: Date.now() }
    );
    
    res.json({ success: true, nft: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});`}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Download SDK
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Download the JavaScript SDK and integrate it into your game.
                  </p>
                  <Button asChild>
                    <a href="/sdk/gamersnft-sdk.js" download>
                      <Download className="h-4 w-4 mr-2" />
                      Download gamersnft-sdk.js
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Documentation;
