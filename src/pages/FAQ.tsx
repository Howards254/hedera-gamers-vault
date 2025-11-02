import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "What is GamersNFT?",
        a: "GamersNFT is an NFT marketplace built specifically for gaming collectibles on Hedera Hashgraph. We make it easy for gamers to mint, buy, and sell unique gaming NFTs with fast transactions and low fees."
      },
      {
        q: "How do I get started?",
        a: "First, install the HashPack wallet (available for Chrome and mobile). Then connect your wallet on GamersNFT, and you're ready to start minting or browsing the marketplace. You'll need some HBAR in your wallet for transactions."
      },
      {
        q: "Do I need cryptocurrency experience?",
        a: "No! We've designed GamersNFT to be beginner-friendly. If you can use a regular website, you can use GamersNFT. Our interface guides you through each step."
      },
      {
        q: "Is GamersNFT free to use?",
        a: "Yes! Creating an account and browsing is completely free. You only pay small transaction fees (around $0.0001) when minting or buying NFTs, plus a 2.5% marketplace fee on sales."
      }
    ]
  },
  {
    category: "Wallets & HBAR",
    questions: [
      {
        q: "What is HashPack?",
        a: "HashPack is the official wallet for Hedera. It's like MetaMask but for Hedera. You can download it as a Chrome extension or mobile app from hashpack.app."
      },
      {
        q: "How do I get HBAR?",
        a: "You can buy HBAR on exchanges like Binance, Coinbase, or Kraken, then send it to your HashPack wallet. For testnet (current version), you can get free test HBAR from the Hedera faucet."
      },
      {
        q: "How much HBAR do I need?",
        a: "Very little! Transactions cost around $0.0001 each. Starting with 10-20 HBAR is more than enough for hundreds of transactions."
      },
      {
        q: "Is my wallet safe?",
        a: "Yes! Your private keys never leave your wallet. We never have access to your funds. Always keep your seed phrase secure and never share it with anyone."
      }
    ]
  },
  {
    category: "Minting NFTs",
    questions: [
      {
        q: "What can I mint as an NFT?",
        a: "You can mint any gaming-related digital collectible: character art, weapon skins, achievement badges, game screenshots, fan art, or any unique gaming content you own the rights to."
      },
      {
        q: "How much does it cost to mint?",
        a: "Minting costs approximately $0.0001 in HBAR for the transaction, plus IPFS storage fees. Total cost is typically less than $0.01 per NFT."
      },
      {
        q: "What file types are supported?",
        a: "We support JPG, PNG, GIF, and WebP images up to 10MB. Your image is stored on IPFS for permanent, decentralized storage."
      },
      {
        q: "Can I add custom attributes?",
        a: "Yes! You can add custom attributes like rarity, power level, game name, or any other metadata to make your NFT unique."
      },
      {
        q: "Who owns the NFT after minting?",
        a: "You do! The NFT is minted directly to your wallet. You have complete ownership and can sell, trade, or keep it forever."
      }
    ]
  },
  {
    category: "Buying & Selling",
    questions: [
      {
        q: "How do I buy an NFT?",
        a: "Browse the marketplace, click on an NFT you like, and click 'Buy Now'. Approve the transaction in your HashPack wallet, and the NFT will be transferred to you instantly."
      },
      {
        q: "How do I sell my NFT?",
        a: "Go to 'My Collectibles', select the NFT you want to sell, set your price in HBAR, and list it. Buyers can purchase it directly from the marketplace."
      },
      {
        q: "What are the marketplace fees?",
        a: "We charge a 2.5% fee on sales. If the NFT has royalties set by the creator, those are paid automatically on each sale."
      },
      {
        q: "Can I cancel a listing?",
        a: "Yes! You can delist your NFT at any time from the 'My Collectibles' page. There's no fee to delist."
      },
      {
        q: "How do I receive payment?",
        a: "When someone buys your NFT, HBAR is sent directly to your wallet automatically. No waiting, no manual transfers."
      }
    ]
  },
  {
    category: "For Game Developers",
    questions: [
      {
        q: "How can I integrate NFTs into my game?",
        a: "Visit our Developers page to register your game and get an API key. Our simple REST API lets you mint NFTs for players with just a few lines of code."
      },
      {
        q: "Do I need blockchain knowledge?",
        a: "No! Our API abstracts all the blockchain complexity. If you can make HTTP requests, you can integrate NFTs."
      },
      {
        q: "What are royalties?",
        a: "Royalties are a percentage you earn every time your NFT is resold. Set between 0-10% when registering your game, and earn passive income from secondary sales."
      },
      {
        q: "Is there a cost to integrate?",
        a: "No! Registration is free. You only pay the tiny transaction fees when minting NFTs (around $0.0001 per NFT)."
      },
      {
        q: "Can I create NFT templates?",
        a: "Yes! Create reusable templates for common items (weapons, characters, etc.) and mint them with custom attributes for each player."
      }
    ]
  },
  {
    category: "About Hedera",
    questions: [
      {
        q: "What is Hedera?",
        a: "Hedera is an enterprise-grade blockchain that's faster, cheaper, and more eco-friendly than Ethereum. It's used by Google, IBM, and major corporations."
      },
      {
        q: "Why Hedera instead of Ethereum?",
        a: "Hedera offers 3-5 second finality vs minutes on Ethereum, costs $0.0001 vs $50+ per transaction, and is carbon negative. Perfect for gaming where speed and low costs matter."
      },
      {
        q: "Is Hedera secure?",
        a: "Yes! Hedera uses a unique consensus algorithm that's more secure than traditional blockchain. It's governed by major corporations and has never been hacked."
      },
      {
        q: "What is HBAR?",
        a: "HBAR is Hedera's native cryptocurrency. It's used to pay for transactions and services on the network. Think of it like gas on Ethereum, but much cheaper."
      }
    ]
  },
  {
    category: "Technical",
    questions: [
      {
        q: "What is IPFS?",
        a: "IPFS (InterPlanetary File System) is decentralized storage for your NFT images and metadata. Files are permanent and can't be deleted or changed."
      },
      {
        q: "What is HIP-412?",
        a: "HIP-412 is Hedera's NFT metadata standard, similar to ERC-721 on Ethereum. It ensures your NFTs are compatible across the Hedera ecosystem."
      },
      {
        q: "Can I view my NFTs in other wallets?",
        a: "Yes! Your NFTs are standard Hedera tokens and can be viewed in any Hedera-compatible wallet like HashPack, Blade, or Kabila."
      },
      {
        q: "What happens if GamersNFT shuts down?",
        a: "Your NFTs are safe! They're stored on Hedera blockchain and IPFS, not on our servers. You'll always own them and can trade them elsewhere."
      }
    ]
  },
  {
    category: "Troubleshooting",
    questions: [
      {
        q: "My wallet won't connect. What do I do?",
        a: "Make sure HashPack extension is installed and unlocked. Try refreshing the page. If issues persist, try disconnecting and reconnecting in HashPack settings."
      },
      {
        q: "Transaction failed. Why?",
        a: "Common reasons: insufficient HBAR balance, network congestion, or wallet not approved. Check your HBAR balance and try again."
      },
      {
        q: "My NFT isn't showing up. Where is it?",
        a: "Wait 5-10 seconds for the Hedera Mirror Node to index your transaction, then refresh the page. If still missing, check your wallet directly."
      },
      {
        q: "I sent HBAR to the wrong address. Can I get it back?",
        a: "Unfortunately, blockchain transactions are irreversible. Always double-check addresses before sending."
      }
    ]
  }
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-foreground max-w-3xl mx-auto">
            Everything you need to know about GamersNFT, Hedera, and gaming NFTs
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="max-w-4xl mx-auto space-y-12">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="text-3xl font-bold mb-6 text-purple-400">{category.category}</h2>
              <div className="space-y-4">
                {category.questions.map((faq, faqIndex) => {
                  const id = `${categoryIndex}-${faqIndex}`;
                  const isOpen = openItems.includes(id);
                  
                  return (
                    <div
                      key={id}
                      className="bg-card/50 backdrop-blur-sm rounded-lg border border-purple-500/20 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleItem(id)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-card/70 transition"
                      >
                        <span className="font-semibold text-lg pr-4">{faq.q}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-purple-400 flex-shrink-0 transition-transform ${
                            isOpen ? 'transform rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-4 text-foreground leading-relaxed">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-12 border border-purple-500/30 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-foreground mb-6">
              Can't find what you're looking for? Join our community or reach out directly.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href="https://discord.gg/gamersnft" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition">
                Join Discord
              </a>
              <a href="https://twitter.com/gamersnft" target="_blank" rel="noopener noreferrer" className="bg-card px-6 py-3 rounded-lg font-semibold hover:bg-card/80 transition">
                Follow on Twitter
              </a>
              <a href="mailto:support@gamersnft.com" className="bg-card px-6 py-3 rounded-lg font-semibold hover:bg-card/80 transition">
                Email Support
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
