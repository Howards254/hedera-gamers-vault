import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import NFTCard from '@/components/NFTCard';
import { useWallet } from '@/hooks/useWallet';
import { useMarketplace } from '@/hooks/useMarketplace';
import { Store, Loader2, Copy, Check, Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/config';

const Marketplace = () => {
  const { walletState } = useWallet();
  const { listings, isLoading, removeListing, refetch } = useMarketplace();
  const [games, setGames] = useState<any[]>([]);
  const [selectedGame, setSelectedGame] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/games`);
      const data = await response.json();
      setGames(data.games || []);
    } catch (error) {
      console.error('Failed to fetch games:', error);
    }
  };

  const filteredListings = listings.filter(nft => {
    // Filter by game
    if (selectedGame === 'user-minted') {
      if (nft.game_id) return false;
    } else if (selectedGame !== 'all') {
      if (nft.game_id !== parseInt(selectedGame)) return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const name = nft.metadataJson?.name?.toLowerCase() || '';
      const description = nft.metadataJson?.description?.toLowerCase() || '';
      if (!name.includes(query) && !description.includes(query)) return false;
    }
    
    // Filter by rarity
    if (selectedRarity !== 'all') {
      const nftRarity = nft.metadataJson?.type || nft.metadataJson?.properties?.attributes?.find((a: any) => a.trait_type === 'Rarity')?.value;
      if (nftRarity?.toLowerCase() !== selectedRarity.toLowerCase()) return false;
    }
    
    return true;
  });
  const { toast } = useToast();
  const [paymentDialog, setPaymentDialog] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentSent, setPaymentSent] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: 'Copied to clipboard!' });
  };

  const handleBuy = (listing: any) => {
    if (!walletState.isConnected || !walletState.account) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to buy NFTs',
        variant: 'destructive',
      });
      return;
    }
    setPaymentDialog(listing);
  };

  const verifyPayment = async () => {
    if (!paymentDialog || !walletState.account) return;

    setIsVerifying(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/verify-and-purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nftId: paymentDialog.id, 
          buyerAccountId: walletState.account.accountId 
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Payment verification failed');
      }

      toast({ 
        title: 'Purchase successful!', 
        description: `You now own ${paymentDialog.metadataJson?.name || 'this NFT'}!` 
      });
      
      setPaymentDialog(null);
      setPaymentSent(false);
      await refetch();
    } catch (error: any) {
      toast({ 
        title: 'Payment not verified', 
        description: error.message, 
        variant: 'destructive' 
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Store className="h-10 w-10 text-primary" />
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  NFT Marketplace
                </span>
              </h1>
              <p className="text-muted-foreground text-lg">
                {filteredListings.length} NFT{filteredListings.length !== 1 ? 's' : ''} available
              </p>
            </div>
            <Button onClick={refetch} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search NFTs by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedGame} onValueChange={setSelectedGame}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All NFTs</SelectItem>
                  <SelectItem value="user-minted">User Minted</SelectItem>
                  {games.map(game => (
                    <SelectItem key={game.id} value={game.id.toString()}>{game.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedRarity} onValueChange={setSelectedRarity}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Rarity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Rarities</SelectItem>
                  <SelectItem value="common">Common</SelectItem>
                  <SelectItem value="rare">Rare</SelectItem>
                  <SelectItem value="epic">Epic</SelectItem>
                  <SelectItem value="legendary">Legendary</SelectItem>
                  <SelectItem value="mythic">Mythic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="text-center py-20">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-muted-foreground">Loading marketplace...</p>
          </div>
        )}

        {!isLoading && filteredListings.length === 0 && listings.length > 0 && (
          <div className="text-center py-20">
            <Search className="h-20 w-20 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No NFTs Found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filters
            </p>
            <Button onClick={() => { setSearchQuery(''); setSelectedGame('all'); setSelectedRarity('all'); }}>
              Clear Filters
            </Button>
          </div>
        )}

        {!isLoading && listings.length === 0 && (
          <div className="text-center py-20">
            <Store className="h-20 w-20 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Listings Available</h3>
            <p className="text-muted-foreground">
              Be the first to list an NFT on the marketplace
            </p>
          </div>
        )}

        {!isLoading && filteredListings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map((listing) => {
              const isOwnNFT = walletState.account?.accountId === listing.owner_account_id;
              return (
              <div key={`${listing.token_id}-${listing.serial_number}`}>
                <NFTCard
                  nft={listing}
                  showActions={!isOwnNFT}
                  onBuy={() => handleBuy(listing)}
                />
                <div className="mt-2 text-center">
                  <p className="text-lg font-bold text-primary">
                    {listing.price} HBAR
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isOwnNFT ? 'Your NFT' : `Seller: ${listing.owner_account_id.slice(0, 10)}...`}
                  </p>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={!!paymentDialog} onOpenChange={() => setPaymentDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>
              Send HBAR to the seller to purchase this NFT
            </DialogDescription>
          </DialogHeader>
          
          {paymentDialog && (() => {
            const platformFee = (paymentDialog.price * 0.05).toFixed(2);
            const sellerAmount = (paymentDialog.price * 0.95).toFixed(2);
            const platformAccount = import.meta.env.VITE_MY_ACCOUNT_ID;
            
            return (
            <div className="space-y-4 pt-4">
              <div className="bg-muted p-4 rounded-lg space-y-3">
                <div>
                  <p className="text-sm font-medium mb-1">Total Price:</p>
                  <p className="text-2xl font-bold text-primary">{paymentDialog.price} HBAR</p>
                  <div className="text-xs text-muted-foreground mt-2 space-y-1">
                    <p>• Seller: {(paymentDialog.price * 0.875).toFixed(2)} HBAR (87.5%)</p>
                    <p>• Creator Royalty: {(paymentDialog.price * 0.05).toFixed(2)} HBAR (5%)</p>
                    <p>• Platform Fee: {(paymentDialog.price * 0.025).toFixed(2)} HBAR (2.5%)</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-1">Send Payment To:</p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-background px-2 py-1 rounded flex-1 truncate">
                      {platformAccount}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(platformAccount)}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border-2 border-primary/20 bg-primary/5 p-4 rounded-lg">
                <p className="text-sm font-semibold mb-2 text-foreground">Instructions:</p>
                <ol className="text-sm space-y-1 list-decimal list-inside text-foreground">
                  <li>Open your HashPack wallet</li>
                  <li>Send exactly {paymentDialog.price} HBAR to the platform account above</li>
                  <li>Wait 5 seconds for blockchain confirmation</li>
                  <li>Click "Verify Payment" below for instant verification</li>
                </ol>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => { setPaymentDialog(null); setPaymentSent(false); }}
                  disabled={isVerifying}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={verifyPayment}
                  disabled={isVerifying}
                >
                  {isVerifying ? 'Verifying...' : 'Verify Payment'}
                </Button>
              </div>
            </div>
            );
          })()}
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Marketplace;