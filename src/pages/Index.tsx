import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { WalletConnect } from '@/components/WalletConnect';
import { Gamepad2, Zap, Shield, TrendingUp, Sparkles, Code, Users, Coins, Rocket } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
        
        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block">
              <Gamepad2 className="h-20 w-20 mx-auto mb-6 text-primary animate-pulse" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                GamersNFT Marketplace
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              The easiest way to add NFTs to your game. Players earn rewards, developers get paid, everyone wins.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <span>$0.001 fees</span>
              </div>
              <div className="flex items-center gap-2">
                <Rocket className="h-4 w-4 text-primary" />
                <span>3-5 sec</span>
              </div>
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-primary" />
                <span>5 min setup</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>Auto-verify</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Link to="/developers">
                <Button size="lg" className="gap-2 text-lg px-8">
                  <Code className="h-5 w-5" />
                  For Developers
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button size="lg" variant="outline" className="gap-2 text-lg px-8">
                  <TrendingUp className="h-5 w-5" />
                  Browse Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Two Audiences Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-background">
            <CardHeader>
              <Code className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-2xl">For Game Developers</CardTitle>
              <CardDescription className="text-base">
                Add NFT rewards to your game in 5 minutes. No blockchain knowledge required.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Register your game</p>
                    <p className="text-sm text-muted-foreground">Get API key instantly</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Create NFT templates</p>
                    <p className="text-sm text-muted-foreground">Define rewards (swords, armor, etc.)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Integrate SDK</p>
                    <p className="text-sm text-muted-foreground">One line of code to mint NFTs</p>
                  </div>
                </div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg font-mono text-xs">
                <code>await nft.mintReward(player, 'legendary_sword');</code>
              </div>
              <Link to="/developers">
                <Button className="w-full gap-2">
                  <Code className="h-4 w-4" />
                  Developer Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-secondary/20 bg-gradient-to-br from-secondary/10 to-background">
            <CardHeader>
              <Users className="h-12 w-12 text-secondary mb-4" />
              <CardTitle className="text-2xl">For Players</CardTitle>
              <CardDescription className="text-base">
                Earn NFT rewards by playing games. Own, trade, and profit from your achievements.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Play integrated games</p>
                    <p className="text-sm text-muted-foreground">Complete achievements & milestones</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Earn NFT rewards</p>
                    <p className="text-sm text-muted-foreground">Automatically minted to your wallet</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Trade on marketplace</p>
                    <p className="text-sm text-muted-foreground">Auto-verified payments in 10 seconds</p>
                  </div>
                </div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-secondary mb-1">2.5% Fee</p>
                <p className="text-xs text-muted-foreground">+ 2-10% creator royalty</p>
              </div>
              <Link to="/marketplace">
                <Button className="w-full gap-2" variant="secondary">
                  <TrendingUp className="h-4 w-4" />
                  Browse Marketplace
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 border-t border-border">
        <h2 className="text-3xl font-bold text-center mb-4">Why GamersNFT?</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Built on Hedera Hashgraph for unmatched speed, security, and affordability
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-primary/20 bg-card/50 backdrop-blur text-center hover:border-primary/40 transition-colors">
            <CardHeader>
              <Zap className="h-10 w-10 text-primary mb-2 mx-auto" />
              <CardTitle>10,000x Cheaper</CardTitle>
              <CardDescription>
                $0.001 per transaction vs $50+ on Ethereum
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-primary/20 bg-card/50 backdrop-blur text-center hover:border-primary/40 transition-colors">
            <CardHeader>
              <Rocket className="h-10 w-10 text-secondary mb-2 mx-auto" />
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                3-5 second finality vs 15+ minutes
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-primary/20 bg-card/50 backdrop-blur text-center hover:border-primary/40 transition-colors">
            <CardHeader>
              <Shield className="h-10 w-10 text-accent mb-2 mx-auto" />
              <CardTitle>Auto-Verify</CardTitle>
              <CardDescription>
                Payments verified automatically every 10 seconds
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-primary/20 bg-card/50 backdrop-blur text-center hover:border-primary/40 transition-colors">
            <CardHeader>
              <Coins className="h-10 w-10 text-primary mb-2 mx-auto" />
              <CardTitle>Creator Royalties</CardTitle>
              <CardDescription>
                Earn 2-10% on every resale forever
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 border-t border-border">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground">
            Join the future of gaming NFTs. Whether you're a developer or player, we've got you covered.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Link to="/developers">
              <Button size="lg" className="gap-2">
                <Code className="h-5 w-5" />
                Register Your Game
              </Button>
            </Link>
            <Link to="/marketplace">
              <Button size="lg" variant="outline" className="gap-2">
                <TrendingUp className="h-5 w-5" />
                Explore Marketplace
              </Button>
            </Link>
          </div>
          <div className="pt-8">
            <WalletConnect />
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;