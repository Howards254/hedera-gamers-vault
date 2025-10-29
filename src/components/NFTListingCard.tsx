import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MarketplaceListing } from '@/types/nft';
import { ShoppingCart, X } from 'lucide-react';

interface NFTListingCardProps {
  listing: MarketplaceListing;
  onBuy?: (tokenId: string, serialNumber: string, price: string) => void;
  onCancel?: (tokenId: string, serialNumber: string) => void;
  isOwner?: boolean;
}

const NFTListingCard = ({ listing, onBuy, onCancel, isOwner = false }: NFTListingCardProps) => {
  // TODO: Phase 4 - Enhance with actual listing data
  
  return (
    <Card className="group overflow-hidden border-border/50 hover:border-secondary/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]">
      <CardHeader className="p-0">
        <div className="aspect-square overflow-hidden bg-muted relative">
          {listing.nft.metadata.image ? (
            <img
              src={listing.nft.metadata.image}
              alt={listing.nft.metadata.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
          
          <div className="absolute top-2 right-2">
            <Badge className="bg-secondary text-secondary-foreground">
              For Sale
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-lg line-clamp-1">{listing.nft.metadata.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {listing.nft.metadata.description}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
          <div className="text-xs text-muted-foreground mb-1">Price</div>
          <div className="text-2xl font-bold text-primary">{listing.price} ℏ</div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Seller: {listing.seller.slice(0, 8)}...</span>
          <span>Serial #{listing.nft.serialNumber}</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {isOwner ? (
          <Button
            className="w-full gap-2"
            variant="destructive"
            onClick={() => onCancel?.(listing.tokenId, listing.serialNumber)}
          >
            <X className="h-4 w-4" />
            Cancel Listing
          </Button>
        ) : (
          <Button
            className="w-full gap-2"
            onClick={() => onBuy?.(listing.tokenId, listing.serialNumber, listing.price)}
          >
            <ShoppingCart className="h-4 w-4" />
            Buy Now
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default NFTListingCard;
