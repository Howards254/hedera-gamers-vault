import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Calendar, User, ArrowRight } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "Introducing GamersNFT: The Future of Gaming Collectibles",
    excerpt: "We're excited to announce the launch of GamersNFT, the first NFT marketplace built specifically for gaming collectibles on Hedera Hashgraph.",
    author: "Karol Onyango",
    date: "November 1, 2024",
    category: "Announcement",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "Why Hedera is Perfect for Gaming NFTs",
    excerpt: "Discover why we chose Hedera Hashgraph over Ethereum and other blockchains for building our gaming NFT marketplace.",
    author: "Basil Odhiambo",
    date: "October 28, 2024",
    category: "Technology",
    readTime: "7 min read"
  },
  {
    id: 3,
    title: "How to Mint Your First Gaming NFT",
    excerpt: "A step-by-step guide to creating your first gaming collectible NFT on GamersNFT. No blockchain experience required!",
    author: "Amos Oluoch",
    date: "October 25, 2024",
    category: "Tutorial",
    readTime: "10 min read"
  },
  {
    id: 4,
    title: "Integrating NFTs into Your Indie Game",
    excerpt: "Learn how game developers can easily add NFT rewards to their games using our simple API. Perfect for indie developers.",
    author: "Paschal Newton",
    date: "October 22, 2024",
    category: "Developer Guide",
    readTime: "12 min read"
  },
  {
    id: 5,
    title: "The Economics of Gaming NFTs",
    excerpt: "Understanding royalties, marketplace fees, and how creators earn from secondary sales on GamersNFT.",
    author: "Karol Onyango",
    date: "October 20, 2024",
    category: "Economics",
    readTime: "8 min read"
  },
  {
    id: 6,
    title: "Security Best Practices for NFT Collectors",
    excerpt: "Essential security tips to protect your gaming NFTs and wallet. Learn about HashPack security features and best practices.",
    author: "Paschal Newton",
    date: "October 18, 2024",
    category: "Security",
    readTime: "6 min read"
  }
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            GamersNFT Blog
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Insights, tutorials, and updates about gaming NFTs, Hedera blockchain, and the future of digital collectibles
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg p-8 border border-purple-500/30">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-purple-500 px-3 py-1 rounded-full text-sm font-semibold">Featured</span>
              <span className="text-gray-400">{blogPosts[0].category}</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">{blogPosts[0].title}</h2>
            <p className="text-gray-300 mb-6 text-lg">{blogPosts[0].excerpt}</p>
            <div className="flex items-center gap-6 text-sm text-gray-400 mb-6">
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
            <button className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition flex items-center gap-2">
              Read More <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.slice(1).map((post) => (
            <div key={post.id} className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20 hover:border-purple-500/40 transition group">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-purple-400 text-sm font-semibold">{post.category}</span>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-purple-400 transition">{post.title}</h3>
              <p className="text-gray-400 mb-4 line-clamp-3">{post.excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{post.date}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{post.readTime}</span>
                <button className="text-purple-400 hover:text-purple-300 transition flex items-center gap-1 text-sm font-semibold">
                  Read More <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="mt-16">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-12 border border-purple-500/30 text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter for the latest updates, tutorials, and insights about gaming NFTs and Hedera blockchain.
            </p>
            <div className="flex gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:outline-none"
              />
              <button className="bg-gradient-to-r from-purple-500 to-pink-600 px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition whitespace-nowrap">
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
