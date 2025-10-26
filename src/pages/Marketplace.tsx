import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import NFTListingCard from '@/components/NFTListingCard';
import { useMarketplace } from '@/hooks/useMarketplace';
import { useWallet } from '@/hooks/useWallet';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, ShoppingBag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Marketplace = () => {
  const { listings, isLoading, fetchListings, buyNFT, cancelListing } = useMarketplace();
  const { walletState } = useWallet();
  const { toast } = useToast();

  useEffect(() => {
    // TODO: Phase 4 - Fetch listings on mount
    fetchListings();
  }, []);

  const handleBuy = async (tokenId: string, serialNumber: string, price: string) => {
    if (!walletState.isConnected) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to purchase NFTs',
        variant: 'destructive',
      });
      return;
    }

    // TODO: Phase 4 - Implement buy logic
    await buyNFT(tokenId, serialNumber, price);
  };

  const handleCancel = async (tokenId: string, serialNumber: string) => {
    // TODO: Phase 4 - Implement cancel listing logic
    await cancelListing(tokenId, serialNumber);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <ShoppingBag className="h-10 w-10 text-primary" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Marketplace
            </span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Browse and purchase unique game collectibles
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search collectibles..."
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-4">
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="weapon">Weapons</SelectItem>
                <SelectItem value="armor">Armor</SelectItem>
                <SelectItem value="consumable">Consumables</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="recent">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recently Listed</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rarity">Rarity</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Listings Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
            <p className="mt-4 text-muted-foreground">Loading marketplace...</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-border rounded-lg">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No Listings Yet</h3>
            <p className="text-muted-foreground">
              Be the first to list your collectibles on the marketplace!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <NFTListingCard
                key={`${listing.tokenId}-${listing.serialNumber}`}
                listing={listing}
                onBuy={handleBuy}
                onCancel={handleCancel}
                isOwner={listing.seller === walletState.account?.accountId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
