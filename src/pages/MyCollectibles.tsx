import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import NFTCard from '@/components/NFTCard';
import { useNFTs } from '@/hooks/useNFTs';
import { useWallet } from '@/hooks/useWallet';
import { useMarketplace } from '@/hooks/useMarketplace';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MyCollectibles = () => {
  const { walletState } = useWallet();
  const { nfts, isLoading, fetchUserNFTs } = useNFTs(walletState.account?.accountId);
  const { listNFT } = useMarketplace();
  const { toast } = useToast();

  const [listingDialog, setListingDialog] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<{ tokenId: string; serialNumber: string } | null>(null);
  const [listingPrice, setListingPrice] = useState('');

  useEffect(() => {
    if (walletState.isConnected) {
      // TODO: Phase 4 - Fetch user's NFTs
      fetchUserNFTs();
    }
  }, [walletState.isConnected]);

  const handleListClick = (tokenId: string, serialNumber: string) => {
    setSelectedNFT({ tokenId, serialNumber });
    setListingDialog(true);
  };

  const handleConfirmListing = async () => {
    if (!selectedNFT || !listingPrice) return;

    // TODO: Phase 4 - Implement listing logic
    await listNFT(selectedNFT.tokenId, selectedNFT.serialNumber, listingPrice);
    
    toast({
      title: 'NFT Listed',
      description: 'Your collectible has been listed on the marketplace',
    });

    setListingDialog(false);
    setSelectedNFT(null);
    setListingPrice('');
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Package className="h-10 w-10 text-primary" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              My Collectibles
            </span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your game collectible NFTs
          </p>
        </div>

        {/* NFTs Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
            <p className="mt-4 text-muted-foreground">Loading your collectibles...</p>
          </div>
        ) : nfts.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-border rounded-lg">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No Collectibles Yet</h3>
            <p className="text-muted-foreground mb-6">
              Start by minting your first game collectible NFT!
            </p>
            <Button asChild>
              <a href="/mint">Mint NFT</a>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {nfts.map((nft) => (
              <NFTCard
                key={`${nft.tokenId}-${nft.serialNumber}`}
                nft={nft}
                onList={handleListClick}
                showListButton
              />
            ))}
          </div>
        )}
      </div>

      {/* Listing Dialog */}
      <Dialog open={listingDialog} onOpenChange={setListingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>List NFT for Sale</DialogTitle>
            <DialogDescription>
              Set a price for your collectible in HBAR
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (HBAR)</Label>
              <Input
                id="price"
                type="number"
                placeholder="100"
                value={listingPrice}
                onChange={(e) => setListingPrice(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setListingDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmListing} disabled={!listingPrice}>
              List for Sale
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyCollectibles;
