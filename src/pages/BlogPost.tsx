import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function BlogPost() {
  return (
    <div className="min-h-screen bg-transparent">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Link to="/blog" className="inline-flex items-center gap-2 text-primary hover:text-purple-300 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <article>
          <div className="mb-8">
            <span className="bg-primary px-3 py-1 rounded-full text-sm font-semibold">Announcement</span>
          </div>

          <h1 className="text-5xl font-bold mb-6">
            Introducing GamersNFT: The Future of Gaming Collectibles
          </h1>

          <div className="flex items-center gap-6 text-muted-foreground mb-8 pb-8 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Karol Onyango</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <span>5 min read</span>
          </div>

          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-xl text-foreground leading-relaxed mb-6">
              We're thrilled to announce the official launch of GamersNFT, the first NFT marketplace built specifically 
              for gaming collectibles on Hedera Hashgraph. After months of development and testing, we're ready to 
              revolutionize how gamers and game developers interact with digital collectibles.
            </p>

            <h2 className="text-3xl font-bold mt-12 mb-4">Why GamersNFT?</h2>
            <p className="text-foreground leading-relaxed mb-6">
              The gaming industry has been exploring NFTs for years, but most solutions are built on expensive, slow 
              blockchains that make them impractical for everyday gamers. We saw an opportunity to change that by 
              leveraging Hedera's unique advantages:
            </p>

            <ul className="space-y-3 text-foreground mb-6">
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span><strong>Lightning Fast:</strong> 3-5 second transaction finality means no waiting around</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span><strong>Ultra Cheap:</strong> $0.0001 per transaction vs $50+ on Ethereum</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span><strong>Eco-Friendly:</strong> Carbon negative blockchain with minimal energy consumption</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span><strong>Enterprise Grade:</strong> Trusted by Google, IBM, and major corporations</span>
              </li>
            </ul>

            <h2 className="text-3xl font-bold mt-12 mb-4">What Can You Do?</h2>
            <p className="text-foreground leading-relaxed mb-6">
              GamersNFT offers a complete ecosystem for gaming collectibles:
            </p>

            <h3 className="text-2xl font-bold mt-8 mb-3">For Gamers</h3>
            <ul className="space-y-2 text-foreground mb-6">
              <li>• Mint unique gaming collectibles with custom attributes</li>
              <li>• Buy and sell NFTs on our marketplace</li>
              <li>• True ownership of your in-game assets</li>
              <li>• Trade with other players globally</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8 mb-3">For Game Developers</h3>
            <ul className="space-y-2 text-foreground mb-6">
              <li>• Simple API to integrate NFTs into your game</li>
              <li>• Earn royalties on secondary sales</li>
              <li>• No blockchain knowledge required</li>
              <li>• Free to get started</li>
            </ul>

            <h2 className="text-3xl font-bold mt-12 mb-4">Our Vision</h2>
            <p className="text-foreground leading-relaxed mb-6">
              We believe that true ownership of digital assets should be accessible to everyone, not just crypto 
              enthusiasts. GamersNFT makes it easy for anyone to mint, buy, and sell gaming collectibles without 
              worrying about high fees or complex blockchain technology.
            </p>

            <p className="text-foreground leading-relaxed mb-6">
              Our team of four Hedera Certified Developers has built a platform that combines the best of blockchain 
              technology with a user-friendly experience that gamers expect. We're not just building a marketplace; 
              we're building the future of gaming collectibles.
            </p>

            <h2 className="text-3xl font-bold mt-12 mb-4">What's Next?</h2>
            <p className="text-foreground leading-relaxed mb-6">
              This is just the beginning. We have exciting features planned for the coming months:
            </p>

            <ul className="space-y-2 text-foreground mb-6">
              <li>• NFT bundles and packs</li>
              <li>• Auction system</li>
              <li>• Mobile app</li>
              <li>• Integration with major game engines</li>
              <li>• Community features and social trading</li>
            </ul>

            <h2 className="text-3xl font-bold mt-12 mb-4">Get Started Today</h2>
            <p className="text-foreground leading-relaxed mb-6">
              Ready to join the future of gaming collectibles? Here's how to get started:
            </p>

            <ol className="space-y-3 text-foreground mb-8">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">1.</span>
                <span>Install HashPack wallet (available for Chrome and mobile)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">2.</span>
                <span>Connect your wallet on GamersNFT</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">3.</span>
                <span>Start minting or browse the marketplace</span>
              </li>
            </ol>

            <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg p-8 border border-primary/30 mt-12">
              <h3 className="text-2xl font-bold mb-4">Join Our Community</h3>
              <p className="text-foreground mb-6">
                Be part of the GamersNFT community and stay updated with the latest features, tutorials, and announcements.
              </p>
              <div className="flex gap-4">
                <Link to="/mint" className="bg-gradient-to-r from-primary to-secondary px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition">
                  Start Minting
                </Link>
                <Link to="/marketplace" className="bg-card px-6 py-3 rounded-lg font-semibold hover:bg-card/80 transition">
                  Browse Marketplace
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>

      <Footer />
    </div>
  );
}
