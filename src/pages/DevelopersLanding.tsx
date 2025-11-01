import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useWallet } from "@/hooks/useWallet";
import { useNavigate } from "react-router-dom";
import { Gamepad2, Zap, Shield, Code, Coins, Users } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function DevelopersLanding() {
  const { accountId, connectWallet } = useWallet();
  const navigate = useNavigate();

  const handleGetStarted = async () => {
    if (accountId) {
      navigate('/developer-dashboard');
    } else {
      await connectWallet();
      navigate('/developer-dashboard');
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-primary/10 to-background">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">
            Reward Your Players with NFTs
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Integrate blockchain-powered rewards into your game in minutes. 
            Mint NFTs, create achievements, and build player loyalty on Hedera.
          </p>
          <Button size="lg" onClick={handleGetStarted} className="text-lg px-8">
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose GamersNFT?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <Zap className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Mint NFTs in 3-5 seconds with Hedera's high-speed network. No gas wars, no delays.
              </p>
            </Card>

            <Card className="p-6">
              <Coins className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Pennies Per NFT</h3>
              <p className="text-muted-foreground">
                $0.001 per transaction. Mint 1000 NFTs for just $1. Perfect for mass rewards.
              </p>
            </Card>

            <Card className="p-6">
              <Code className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Simple Integration</h3>
              <p className="text-muted-foreground">
                5 lines of code. REST API. Works with any game engine. Unity, Unreal, Web, Mobile.
              </p>
            </Card>

            <Card className="p-6">
              <Shield className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Enterprise Security</h3>
              <p className="text-muted-foreground">
                Built on Hedera - used by Google, IBM, Boeing. Bank-grade security for your assets.
              </p>
            </Card>

            <Card className="p-6">
              <Users className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Built-in Marketplace</h3>
              <p className="text-muted-foreground">
                Players can trade NFTs instantly. You earn royalties on every sale. Passive income.
              </p>
            </Card>

            <Card className="p-6">
              <Gamepad2 className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Gaming First</h3>
              <p className="text-muted-foreground">
                Designed for games. Achievements, leaderboards, seasonal rewards. Everything you need.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Register Your Game</h3>
                <p className="text-muted-foreground">
                  Connect wallet, fill in game details, get your API key instantly.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Create NFT Templates</h3>
                <p className="text-muted-foreground">
                  Design your rewards - achievements, items, characters. Set rarity and attributes.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Integrate SDK</h3>
                <p className="text-muted-foreground">
                  Add 5 lines of code to your game. Works with any language or engine.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Reward Players</h3>
                <p className="text-muted-foreground">
                  Mint NFTs when players achieve milestones. Automatic, instant, secure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-muted-foreground mb-8">
            No monthly fees. No hidden costs. Pay only for what you use.
          </p>
          
          <Card className="p-8 max-w-md mx-auto">
            <h3 className="text-2xl font-bold mb-4">Pay As You Go</h3>
            <div className="text-4xl font-bold mb-2">$0.001</div>
            <p className="text-muted-foreground mb-6">per NFT minted</p>
            <ul className="text-left space-y-2 mb-6">
              <li>✓ Unlimited API calls</li>
              <li>✓ Built-in marketplace</li>
              <li>✓ 2-10% royalties on sales</li>
              <li>✓ Full SDK access</li>
              <li>✓ Priority support</li>
            </ul>
            <Button size="lg" onClick={handleGetStarted} className="w-full">
              Start Building
            </Button>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Level Up Your Game?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join game developers already rewarding millions of players with NFTs
          </p>
          <Button size="lg" variant="secondary" onClick={handleGetStarted} className="text-lg px-8">
            Get Your API Key Now
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
