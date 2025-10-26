import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import WalletConnect from '@/components/WalletConnect';
import { Gamepad2, Zap, Shield, TrendingUp, Sparkles } from 'lucide-react';

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
              Mint, buy, and sell unique game collectibles on Hedera. 
              Built for gamers, powered by blockchain.
            </p>

            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Link to="/marketplace">
                <Button size="lg" className="gap-2 text-lg px-8">
                  <TrendingUp className="h-5 w-5" />
                  Explore Marketplace
                </Button>
              </Link>
              <Link to="/mint">
                <Button size="lg" variant="outline" className="gap-2 text-lg px-8">
                  <Sparkles className="h-5 w-5" />
                  Mint NFT
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-primary/20 bg-card/50 backdrop-blur">
            <CardHeader>
              <Zap className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                Powered by Hedera's high-speed network. Mint and trade in seconds, not minutes.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-primary/20 bg-card/50 backdrop-blur">
            <CardHeader>
              <Shield className="h-10 w-10 text-secondary mb-2" />
              <CardTitle>Secure & Decentralized</CardTitle>
              <CardDescription>
                Your collectibles are secured by Hedera's enterprise-grade blockchain technology.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-primary/20 bg-card/50 backdrop-blur">
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-accent mb-2" />
              <CardTitle>Royalty System</CardTitle>
              <CardDescription>
                Creators earn royalties on every secondary sale. Fair compensation for game developers.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Wallet Connection */}
        <div className="max-w-md mx-auto">
          <WalletConnect />
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20 border-t border-border">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          How It Works
        </h2>
        
        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {[
            { step: '1', title: 'Connect Wallet', desc: 'Link your HashPack wallet to get started' },
            { step: '2', title: 'Mint NFT', desc: 'Create unique game collectibles with custom attributes' },
            { step: '3', title: 'List for Sale', desc: 'Set your price and list on the marketplace' },
            { step: '4', title: 'Trade & Earn', desc: 'Buy, sell, and earn royalties on trades' },
          ].map((item) => (
            <div key={item.step} className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-bold mx-auto">
                {item.step}
              </div>
              <h3 className="font-bold text-lg">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
