import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { useWallet } from '@/hooks/useWallet';
import { Button } from '@/components/ui/button';
import { API_BASE_URL } from '@/config';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Code, Plus, Gamepad2, Copy, Check, Terminal, Eye, EyeOff, ExternalLink, Activity, Zap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const DeveloperDashboard = () => {
  const { walletState } = useWallet();
  const { toast } = useToast();
  const [games, setGames] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [showApiKey, setShowApiKey] = useState<{[key: number]: boolean}>({});
  const [registerOpen, setRegisterOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);

  useEffect(() => {
    if (walletState.account) {
      fetchGames();
    }
  }, [walletState.account]);

  const fetchGames = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/games/my-games/${walletState.account?.accountId}`);
      const data = await response.json();
      setGames(data.games || []);
    } catch (error) {
      console.error('Failed to fetch games:', error);
    }
  };

  const fetchTemplates = async (gameId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/games/${gameId}/templates`);
      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    }
  };

  const handleRegisterGame = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/games/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          description: formData.get('description'),
          developerAccountId: walletState.account?.accountId,
          royaltyPercentage: parseFloat(formData.get('royaltyPercentage') as string),
          logoUrl: formData.get('logoUrl'),
          websiteUrl: formData.get('websiteUrl')
        })
      });
      
      const data = await response.json();
      if (data.success) {
        toast({ title: 'Game registered successfully!' });
        setRegisterOpen(false);
        fetchGames();
      }
    } catch (error: any) {
      toast({ title: 'Failed to register game', description: error.message, variant: 'destructive' });
    }
  };

  const handleCreateTemplate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedGame) return;
    
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/games/${selectedGame.id}/templates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: selectedGame.api_key,
          name: formData.get('name'),
          description: formData.get('description'),
          imageUrl: formData.get('imageUrl'),
          type: formData.get('type'),
          rarity: formData.get('rarity'),
          attributes: { Type: formData.get('type') }
        })
      });
      
      const data = await response.json();
      if (data.success) {
        toast({ title: `Template created! ID: ${data.templateId}` });
        setTemplateOpen(false);
        fetchTemplates(selectedGame.id);
      }
    } catch (error: any) {
      toast({ title: 'Failed to create template', description: error.message, variant: 'destructive' });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: 'Copied to clipboard!' });
  };

  if (!walletState.isConnected) {
    return (
      <div className="min-h-screen bg-transparent">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-2xl mx-auto border-primary/20">
            <CardHeader className="text-center">
              <Terminal className="h-16 w-16 mx-auto text-primary mb-4" />
              <CardTitle className="text-3xl">Developer Access Required</CardTitle>
              <CardDescription className="text-base">
                Connect your Hedera wallet to access the developer dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p className="text-sm font-semibold">What you'll get:</p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• API keys for game integration</li>
                  <li>• NFT template management</li>
                  <li>• Configurable creator royalties (2-10%)</li>
                  <li>• Real-time minting capabilities</li>
                </ul>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Your wallet address will be used as your developer identity
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Terminal className="h-10 w-10 text-primary" />
              Developer Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">
              <code className="bg-muted px-2 py-1 rounded text-sm">{walletState.account?.accountId}</code>
            </p>
          </div>
          
          <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Register Game
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Register New Game</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleRegisterGame} className="space-y-4">
                <div>
                  <Label htmlFor="name">Game Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" required />
                </div>
                <div>
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <Input id="logoUrl" name="logoUrl" type="url" />
                </div>
                <div>
                  <Label htmlFor="websiteUrl">Website URL</Label>
                  <Input id="websiteUrl" name="websiteUrl" type="url" />
                </div>
                <div>
                  <Label htmlFor="royaltyPercentage">Creator Royalty (%)</Label>
                  <Select name="royaltyPercentage" defaultValue="5">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2% - Low</SelectItem>
                      <SelectItem value="5">5% - Standard (Recommended)</SelectItem>
                      <SelectItem value="7">7% - High</SelectItem>
                      <SelectItem value="10">10% - Premium</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">You earn this % on every NFT resale</p>
                </div>
                <Button type="submit" className="w-full">Register Game</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {games.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="py-20 text-center">
              <Gamepad2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Games Registered</h3>
              <p className="text-muted-foreground mb-4">Register your first game to start minting NFT rewards</p>
              <Button onClick={() => setRegisterOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Register Your First Game
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-primary/20">
                <CardHeader className="pb-3">
                  <CardDescription>Total Games</CardDescription>
                  <CardTitle className="text-3xl">{games.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card className="border-primary/20">
                <CardHeader className="pb-3">
                  <CardDescription>Active API Keys</CardDescription>
                  <CardTitle className="text-3xl flex items-center gap-2">
                    {games.length}
                    <Badge variant="outline" className="text-xs">Live</Badge>
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card className="border-primary/20">
                <CardHeader className="pb-3">
                  <CardDescription>Avg. Royalty</CardDescription>
                  <CardTitle className="text-3xl text-primary">
                    {(games.reduce((sum, g) => sum + g.royalty_percentage, 0) / games.length).toFixed(1)}%
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>
            <div className="grid gap-6">
              {games.map((game) => (
                <Card key={game.id} className="border-primary/20">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-2xl">{game.name}</CardTitle>
                          <Badge variant="outline" className="gap-1">
                            <Activity className="h-3 w-3" />
                            Active
                          </Badge>
                        </div>
                        <CardDescription>{game.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="integration">Integration</TabsTrigger>
                        <TabsTrigger value="templates">Templates</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="overview" className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs text-muted-foreground">Game ID</Label>
                            <p className="text-sm font-mono mt-1">{game.id}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Creator Royalty</Label>
                            <p className="text-sm font-semibold text-primary mt-1">{game.royalty_percentage}% per resale</p>
                          </div>
                        </div>
                        {game.website_url && (
                          <a href={game.website_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                            Visit Website <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="integration" className="space-y-4 mt-4">
                        <div>
                          <Label className="text-xs text-muted-foreground flex items-center gap-2">
                            API Key
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-5 px-2"
                              onClick={() => setShowApiKey({...showApiKey, [game.id]: !showApiKey[game.id]})}
                            >
                              {showApiKey[game.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                            </Button>
                          </Label>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="flex-1 bg-muted px-3 py-2 rounded text-sm font-mono">
                              {showApiKey[game.id] ? game.api_key : '•'.repeat(game.api_key.length)}
                            </code>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(game.api_key)}
                            >
                              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        
                        <div className="bg-muted p-4 rounded-lg">
                          <p className="text-xs font-semibold mb-2">Quick Start</p>
                          <pre className="text-xs overflow-x-auto">
                            <code>{`const sdk = new GamersNFT('${game.api_key}');
await sdk.initialize();
await sdk.mintReward(playerAccount, 'template_id');`}</code>
                          </pre>
                        </div>
                        
                        <Button asChild variant="outline" className="w-full gap-2">
                          <a href="/docs" target="_blank">
                            <Code className="h-4 w-4" />
                            View Full Documentation
                          </a>
                        </Button>
                      </TabsContent>
                      
                      <TabsContent value="templates" className="mt-4">
                        <Button
                          onClick={() => {
                            setSelectedGame(game);
                            fetchTemplates(game.id);
                          }}
                          className="w-full gap-2"
                        >
                          <Zap className="h-4 w-4" />
                          Manage NFT Templates
                        </Button>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {selectedGame && (
          <Dialog open={!!selectedGame} onOpenChange={() => setSelectedGame(null)}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{selectedGame.name} - NFT Templates</DialogTitle>
              </DialogHeader>
              
              <Button onClick={() => setTemplateOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Template
              </Button>

              <div className="grid grid-cols-2 gap-4 mt-4">
                {templates.map((template) => (
                  <Card key={template.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-semibold">Template ID:</span> <code className="bg-muted px-1 rounded">{template.template_id}</code></p>
                        <p><span className="font-semibold">Type:</span> {template.type}</p>
                        <p><span className="font-semibold">Rarity:</span> {template.rarity}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        )}

        <Dialog open={templateOpen} onOpenChange={setTemplateOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create NFT Template</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateTemplate} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required placeholder="Legendary Sword" />
                <p className="text-xs text-muted-foreground mt-1">Template ID will be auto-generated</p>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Input id="type" name="type" required placeholder="Weapon, Armor, etc." />
                </div>
                <div>
                  <Label htmlFor="rarity">Rarity</Label>
                  <Select name="rarity" defaultValue="Common">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Common">Common</SelectItem>
                      <SelectItem value="Rare">Rare</SelectItem>
                      <SelectItem value="Epic">Epic</SelectItem>
                      <SelectItem value="Legendary">Legendary</SelectItem>
                      <SelectItem value="Mythic">Mythic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" required rows={3} />
              </div>
              
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input id="imageUrl" name="imageUrl" required type="url" placeholder="https://..." />
              </div>
              
              <Button type="submit" className="w-full">Create Template</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DeveloperDashboard;
