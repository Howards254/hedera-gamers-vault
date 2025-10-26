import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NFT } from '@/types/nft';
import { ShoppingCart, Tag } from 'lucide-react';

interface NFTCardProps {
  nft: NFT;
  onList?: (tokenId: string, serialNumber: string) => void;
  showListButton?: boolean;
}

const NFTCard = ({ nft, onList, showListButton = false }: NFTCardProps) => {
  // TODO: Phase 4 - Enhance with actual metadata display
  
  const getRarityColor = (rarity: string) => {
    switch (rarity?.toLowerCase()) {
      case 'common':
        return 'bg-slate-500';
      case 'rare':
        return 'bg-blue-500';
      case 'epic':
        return 'bg-purple-500';
      case 'legendary':
        return 'bg-orange-500';
      case 'mythic':
        return 'bg-pink-500';
      default:
        return 'bg-muted';
    }
  };

  return (
    <Card className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(147,51,234,0.3)]">
      <CardHeader className="p-0">
        <div className="aspect-square overflow-hidden bg-muted">
          {nft.metadata.image ? (
            <img
              src={nft.metadata.image}
              alt={nft.metadata.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-lg line-clamp-1">{nft.metadata.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {nft.metadata.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {nft.metadata.attributes?.map((attr, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {attr.trait_type}: {attr.value}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Serial #{nft.serialNumber}</span>
          <span className="font-mono">{nft.tokenId.slice(0, 8)}...</span>
        </div>
      </CardContent>

      {showListButton && (
        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full gap-2"
            variant="outline"
            onClick={() => onList?.(nft.tokenId, nft.serialNumber)}
          >
            <Tag className="h-4 w-4" />
            List for Sale
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default NFTCard;
