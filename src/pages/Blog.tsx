import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Calendar, User, ArrowRight } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "Introducing GamersNFT: The Future of Gaming Collectibles",
    excerpt: "We're excited to announce the launch of GamersNFT, the first NFT marketplace built specifically for gaming collectibles on Hedera Hashgraph.",
    author: "Karol Onyango",
    date: "October 31, 2025",
    category: "Announcement",
    readTime: "5 min read"
  }
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-transparent">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            GamersNFT Blog
          </h1>
          <p className="text-xl text-foreground max-w-3xl mx-auto">
            Insights, tutorials, and updates about gaming NFTs, Hedera blockchain, and the future of digital collectibles
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg p-8 border border-primary/30">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-primary px-3 py-1 rounded-full text-sm font-semibold">Featured</span>
              <span className="text-muted-foreground">{blogPosts[0].category}</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">{blogPosts[0].title}</h2>
            <p className="text-foreground mb-6 text-lg">{blogPosts[0].excerpt}</p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{blogPosts[0].author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{blogPosts[0].date}</span>
              </div>
              <span>{blogPosts[0].readTime}</span>
            </div>
            <a href="/blog/introducing-gamersnft">
              <button className="bg-gradient-to-r from-primary to-secondary px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition flex items-center gap-2">
                Read More <ArrowRight className="w-4 h-4" />
              </button>
            </a>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="text-center py-16">
          <div className="bg-card/50 backdrop-blur-sm rounded-lg p-12 border border-primary/20">
            <h2 className="text-2xl font-bold mb-4">More Articles Coming Soon</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're working on more tutorials, guides, and insights about gaming NFTs and Hedera blockchain. 
              Subscribe to our newsletter to get notified when new articles are published.
            </p>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-16">
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg p-12 border border-primary/30 text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-foreground mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter for the latest updates, tutorials, and insights about gaming NFTs and Hedera blockchain.
            </p>
            <div className="flex gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:outline-none"
              />
              <button className="bg-gradient-to-r from-primary to-secondary px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
