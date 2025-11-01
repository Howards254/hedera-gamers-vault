import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Gamepad2, Wallet, Menu, X } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { useState } from 'react';

const Navigation = () => {
  const location = useLocation();
  const { walletState, connectWallet, disconnectWallet, isConnecting } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
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
              <Link to="/developers">
                <Button
                  variant={isActive('/developers') ? 'default' : 'ghost'}
                  className="font-medium"
                >
                  Developers
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  variant={isActive('/about') ? 'default' : 'ghost'}
                  className="font-medium"
                >
                  About
                </Button>
              </Link>
              <Link to="/blog">
                <Button
                  variant={isActive('/blog') ? 'default' : 'ghost'}
                  className="font-medium"
                >
                  Blog
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            <div className="hidden md:block">
              {walletState.isConnected ? (
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <div className="text-sm font-medium">
                      {walletState.account?.accountId}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {walletState.account?.balance || '0'} HBAR
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={disconnectWallet}>
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant={isActive('/') ? 'default' : 'ghost'}
                  className="w-full justify-start font-medium"
                >
                  Home
                </Button>
              </Link>
              <Link to="/marketplace" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant={isActive('/marketplace') ? 'default' : 'ghost'}
                  className="w-full justify-start font-medium"
                >
                  Marketplace
                </Button>
              </Link>
              <Link to="/my-collectibles" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant={isActive('/my-collectibles') ? 'default' : 'ghost'}
                  className="w-full justify-start font-medium"
                >
                  My Collectibles
                </Button>
              </Link>
              <Link to="/mint" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant={isActive('/mint') ? 'default' : 'ghost'}
                  className="w-full justify-start font-medium"
                >
                  Mint NFT
                </Button>
              </Link>
              <Link to="/developers" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant={isActive('/developers') ? 'default' : 'ghost'}
                  className="w-full justify-start font-medium"
                >
                  Developers
                </Button>
              </Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant={isActive('/about') ? 'default' : 'ghost'}
                  className="w-full justify-start font-medium"
                >
                  About
                </Button>
              </Link>
              <Link to="/blog" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant={isActive('/blog') ? 'default' : 'ghost'}
                  className="w-full justify-start font-medium"
                >
                  Blog
                </Button>
              </Link>

              <div className="pt-2 border-t border-border mt-2">
                {walletState.isConnected ? (
                  <>
                    <div className="px-3 py-2 mb-2">
                      <div className="text-sm font-medium">
                        {walletState.account?.accountId}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {walletState.account?.balance || '0'} HBAR
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        disconnectWallet();
                        setMobileMenuOpen(false);
                      }}
                    >
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => {
                      connectWallet();
                      setMobileMenuOpen(false);
                    }}
                    disabled={isConnecting}
                    className="w-full gap-2"
                  >
                    <Wallet className="h-4 w-4" />
                    {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
