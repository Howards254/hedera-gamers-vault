import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Gamepad2, Wallet } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';

const Navigation = () => {
  const location = useLocation();
  const { walletState, connectWallet, disconnectWallet, isConnecting } = useWallet();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <Gamepad2 className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                GamersNFT
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-4">
              <Link to="/">
                <Button
                  variant={isActive('/') ? 'default' : 'ghost'}
                  className="font-medium"
                >
                  Home
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button
                  variant={isActive('/marketplace') ? 'default' : 'ghost'}
                  className="font-medium"
                >
                  Marketplace
                </Button>
              </Link>
              <Link to="/my-collectibles">
                <Button
                  variant={isActive('/my-collectibles') ? 'default' : 'ghost'}
                  className="font-medium"
                >
                  My Collectibles
                </Button>
              </Link>
              <Link to="/mint">
                <Button
                  variant={isActive('/mint') ? 'default' : 'ghost'}
                  className="font-medium"
                >
                  Mint NFT
                </Button>
              </Link>
            </div>
          </div>

          <div>
            {walletState.isConnected ? (
              <div className="flex items-center gap-3">
                <div className="text-sm text-muted-foreground">
                  {walletState.account?.accountId}
                </div>
                <Button variant="outline" onClick={disconnectWallet}>
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                onClick={connectWallet}
                disabled={isConnecting}
                className="gap-2"
              >
                <Wallet className="h-4 w-4" />
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
