import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ShoppingCart, Eye, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { NFT } from '@/hooks/useNFTs';

interface NFTCardProps {
  nft: NFT & { id?: number };
  showActions?: boolean;
  onBuy?: () => void;
  onList?: (nftId: number, price: number) => void;
  onDelist?: (nftId: number) => void;
  showListButton?: boolean;
  showDelistButton?: boolean;
}

const NFTCard = ({ nft, showActions = true, onBuy, onList, onDelist, showListButton = false, showDelistButton = false }: NFTCardProps) => {
  const [price, setPrice] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleList = async () => {
    if (!price || !nft.id) return;
    
    try {
      await onList?.(nft.id, parseFloat(price));
      toast({ title: 'NFT listed successfully!' });
      setIsOpen(false);
      setPrice('');
    } catch (error: any) {
      toast({ title: 'Failed to list NFT', description: error.message, variant: 'destructive' });
    }
  };
  const metadata = nft.metadataJson;
  const gateway = import.meta.env.VITE_PINATA_GATEWAY || 'gateway.pinata.cloud';
  
  // Extract image URL from metadata
  const imageUrl = metadata?.image?.replace('ipfs://', `https://${gateway}/ipfs/`) || '/placeholder.svg';
  
  // Get rarity from metadata (check multiple locations)
  const rarity = metadata?.type || 
    metadata?.properties?.attributes?.find(
      (attr: any) => attr.trait_type === 'Rarity'
    )?.value || 
    'Common';

  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      Common: 'bg-gray-500',
      Rare: 'bg-blue-500',
      Epic: 'bg-purple-500',
      Legendary: 'bg-orange-500',
      Mythic: 'bg-red-500',
    };
    return colors[rarity] || 'bg-gray-500';
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow border-primary/20">
      <CardHeader className="p-0">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={metadata?.name || 'NFT'}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
          <Badge className={`absolute top-2 right-2 ${getRarityColor(rarity)}`}>
            {rarity}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-1 truncate">
          {metadata?.name || 'Unnamed NFT'}
        </h3>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
          {metadata?.description || 'No description'}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Token: {nft.token_id}</span>
          <span>Serial: #{nft.serial_number}</span>
        </div>

        {metadata?.properties?.attributes && (
          <div className="mt-3 flex flex-wrap gap-1">
            {metadata.properties.attributes.slice(0, 3).map((attr: any, idx: number) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {attr.trait_type}: {attr.value}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      {showActions && (
        <CardFooter className="p-4 pt-0 flex gap-2">
          {showListButton && onList && (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex-1">
                  <Tag className="h-4 w-4 mr-2" />
                  List for Sale
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>List NFT for Sale</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <label className="text-sm font-medium">Price (HBAR)</label>
                    <Input
                      type="number"
                      placeholder="Enter price in HBAR"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      min="0"
                      step="0.1"
                    />
                  </div>
                  <Button onClick={handleList} className="w-full" disabled={!price}>
                    List NFT
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
          {showDelistButton && onDelist && nft.id && (
            <Button size="sm" variant="outline" className="flex-1" onClick={() => onDelist(nft.id!)}>
              <Tag className="h-4 w-4 mr-2" />
              Delist
            </Button>
          )}
          {onBuy && (
            <Button size="sm" className="flex-1" onClick={onBuy}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Buy
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default NFTCard;