import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Users, Target, Zap, Shield } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-transparent">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            About GamersNFT
          </h1>
          <p className="text-xl text-foreground max-w-3xl mx-auto">
            The first NFT marketplace built specifically for gaming collectibles on Hedera Hashgraph
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <div className="bg-card/50 backdrop-blur-sm rounded-lg p-8 border border-purple-500/20">
            <h2 className="text-3xl font-bold mb-4 text-primary">Our Mission</h2>
            <p className="text-foreground text-lg leading-relaxed">
              We're building the future of gaming collectibles by making NFTs accessible, affordable, and practical for gamers and game developers. 
              By leveraging Hedera's fast and eco-friendly blockchain, we enable true ownership of in-game assets without the high costs and slow 
              transactions that plague other platforms.
            </p>
          </div>
        </div>

        {/* Why Hedera Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Hedera?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
              <Zap className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">3-5 second transaction finality vs minutes on other chains</p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
              <Shield className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Ultra Cheap</h3>
              <p className="text-muted-foreground">$0.0001 per transaction vs $50+ on Ethereum</p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
              <Target className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Eco-Friendly</h3>
              <p className="text-muted-foreground">Carbon negative blockchain with minimal energy use</p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Enterprise Grade</h3>
              <p className="text-muted-foreground">Used by Google, IBM, and major enterprises</p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Team</h2>
          <p className="text-center text-muted-foreground mb-8">All Hedera Certified Developers</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary via-accent to-secondary rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
                KO
              </div>
              <h3 className="text-xl font-bold mb-1">Karol Onyango</h3>
              <p className="text-primary mb-2">Founder & Lead Developer</p>
              <p className="text-sm text-muted-foreground">Full-stack blockchain developer</p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary via-accent to-secondary rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
                BO
              </div>
              <h3 className="text-xl font-bold mb-1">Basil Odhiambo</h3>
              <p className="text-primary mb-2">Blockchain Developer</p>
              <p className="text-sm text-muted-foreground">Smart contract integration</p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary via-accent to-secondary rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
                AO
              </div>
              <h3 className="text-xl font-bold mb-1">Amos Oluoch</h3>
              <p className="text-primary mb-2">Blockchain Developer</p>
              <p className="text-sm text-muted-foreground">Distributed systems expert</p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary via-accent to-secondary rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
                PN
              </div>
              <h3 className="text-xl font-bold mb-1">Paschal Newton</h3>
              <p className="text-primary mb-2">Blockchain Developer</p>
              <p className="text-sm text-muted-foreground">Security specialist</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-16">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg p-8 text-center border border-primary/30">
              <div className="text-4xl font-bold mb-2">$0.0001</div>
              <div className="text-muted-foreground">Per Transaction</div>
            </div>
            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg p-8 text-center border border-primary/30">
              <div className="text-4xl font-bold mb-2">3-5s</div>
              <div className="text-muted-foreground">Transaction Speed</div>
            </div>
            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg p-8 text-center border border-primary/30">
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-muted-foreground">Carbon Negative</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg p-12 border border-primary/30">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-foreground mb-6 max-w-2xl mx-auto">
              Join the future of gaming collectibles. Mint, buy, and sell NFTs on the fastest and cheapest blockchain.
            </p>
            <div className="flex gap-4 justify-center">
              <a href="/mint" className="bg-gradient-to-r from-primary to-secondary px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition">
                Start Minting
              </a>
              <a href="/marketplace" className="bg-card px-8 py-3 rounded-lg font-semibold hover:bg-card/80 transition">
                Browse Marketplace
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
