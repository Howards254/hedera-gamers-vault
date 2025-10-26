import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, Copy, ExternalLink } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/hooks/use-toast';

const WalletConnect = () => {
  const { walletState, connectWallet, disconnectWallet, isConnecting } = useWallet();
  const { toast } = useToast();

  const copyAccountId = () => {
    if (walletState.account?.accountId) {
      navigator.clipboard.writeText(walletState.account.accountId);
      toast({
        title: 'Copied!',
        description: 'Account ID copied to clipboard',
      });
    }
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card to-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          HashPack Wallet
        </CardTitle>
        <CardDescription>
          Connect your HashPack wallet to interact with the marketplace
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {walletState.isConnected ? (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-background/50 space-y-3">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Account ID</div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm">{walletState.account?.accountId}</span>
                  <Button variant="ghost" size="sm" onClick={copyAccountId}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground mb-1">HBAR Balance</div>
                <div className="text-2xl font-bold text-primary">
                  {walletState.account?.balance || '0'} ℏ
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={disconnectWallet}>
                Disconnect
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a
                  href={`https://hashscan.io/testnet/account/${walletState.account?.accountId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Connect your HashPack wallet to start minting, buying, and selling game collectibles on Hedera.
            </p>
            <Button
              className="w-full"
              onClick={connectWallet}
              disabled={isConnecting}
            >
              <Wallet className="mr-2 h-4 w-4" />
              {isConnecting ? 'Connecting...' : 'Connect HashPack'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WalletConnect;
