import Navigation from '@/components/Navigation';
import NFTCard from '@/components/NFTCard';
import { useWallet } from '@/hooks/useWallet';
import { useNFTs } from '@/hooks/useNFTs';
import { Wallet, Package, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/config';

const MyCollectibles = () => {
  const { walletState } = useWallet();
  const { nfts, isLoading, error, refetch } = useNFTs();
  const { toast } = useToast();

  const handleListNFT = async (nftId: number, price: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/list-nft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nftId, price, ownerAccountId: walletState.account?.accountId }),
      });

      if (!response.ok) throw new Error('Failed to list NFT');
      
      await refetch();
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  if (!walletState.isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-md mx-auto space-y-4">
            <Wallet className="h-20 w-20 mx-auto text-muted-foreground" />
            <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
            <p className="text-muted-foreground">
              Please connect your HashPack wallet to view your collectibles
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Package className="h-10 w-10 text-primary" />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                My Collectibles
              </span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Your gaming NFT collection on Hedera
            </p>
          </div>
          <Button onClick={refetch} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}
          </Button>
        </div>

        {isLoading && (
          <div className="text-center py-20">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-muted-foreground">Loading your collectibles...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-destructive">{error}</p>
            <Button onClick={refetch} className="mt-4">Try Again</Button>
          </div>
        )}

        {!isLoading && !error && nfts.length === 0 && (
          <div className="text-center py-20">
            <Package className="h-20 w-20 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Collectibles Yet</h3>
            <p className="text-muted-foreground">
              Start minting NFTs to build your collection
            </p>
          </div>
        )}

        {!isLoading && !error && nfts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {nfts.map((nft) => (
              <NFTCard
                key={`${nft.token_id}-${nft.serial_number}`}
                nft={nft}
                showActions={true}
                showListButton={true}
                onList={handleListNFT}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCollectibles;