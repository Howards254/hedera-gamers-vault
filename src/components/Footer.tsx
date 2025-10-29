import { Link } from 'react-router-dom';
import { Gamepad2, Twitter, Github, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/30 backdrop-blur-sm mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Gamepad2 className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                GamersNFT
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              The easiest way to add NFTs to your game. Built on Hedera Hashgraph.
            </p>
            <div className="flex gap-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/marketplace" className="text-muted-foreground hover:text-primary transition-colors">Marketplace</Link></li>
              <li><Link to="/my-collectibles" className="text-muted-foreground hover:text-primary transition-colors">My Collectibles</Link></li>
              <li><Link to="/mint" className="text-muted-foreground hover:text-primary transition-colors">Mint NFT</Link></li>
              <li><Link to="/developers" className="text-muted-foreground hover:text-primary transition-colors">Developer Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Developers</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/docs" className="text-muted-foreground hover:text-primary transition-colors">Documentation</Link></li>
              <li><a href="/sdk/gamersnft-sdk.js" download className="text-muted-foreground hover:text-primary transition-colors">JavaScript SDK</a></li>
              <li><a href="/demo-game/index.html" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">Demo Game</a></li>
              <li><a href="https://docs.hedera.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">Hedera Docs</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://hedera.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">About Hedera</a></li>
              <li><a href="https://www.hashpack.app" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">HashPack Wallet</a></li>
              <li><a href="https://pinata.cloud" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">Pinata IPFS</a></li>
              <li><a href="https://hashscan.io/testnet" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">Hedera Explorer</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; 2024 GamersNFT. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
