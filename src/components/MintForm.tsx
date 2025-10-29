import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Plus, X, Upload, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWalletContext } from '@/contexts/WalletContext';
import { uploadToPinata, uploadMetadataToPinata, createNFTMetadata, createNFTCollection, mintNFT, associateToken, transferNFT } from '@/lib/hedera';

const MintForm = () => {
  const { toast } = useToast();
  const { walletState, hashConnect, topic } = useWalletContext();
  const [isMinting, setIsMinting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [collectionTokenId, setCollectionTokenId] = useState<string>('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    rarity: 'Common',
    image: null as File | null,
    attributes: [] as { trait: string; value: string }[],
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addAttribute = () => {
    setFormData({
      ...formData,
      attributes: [...formData.attributes, { trait: '', value: '' }],
    });
  };

  const removeAttribute = (index: number) => {
    setFormData({
      ...formData,
      attributes: formData.attributes.filter((_, i) => i !== index),
    });
  };

  const updateAttribute = (index: number, field: 'trait' | 'value', value: string) => {
    const newAttributes = [...formData.attributes];
    newAttributes[index][field] = value;
    setFormData({ ...formData, attributes: newAttributes });
  };

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!walletState.isConnected || !walletState.account || !hashConnect) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet first',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.image) {
      toast({
        title: 'Image required',
        description: 'Please upload an image for your NFT',
        variant: 'destructive',
      });
      return;
    }

    setIsMinting(true);

    try {
      toast({ title: 'Uploading image to IPFS...' });
      const imageCID = await uploadToPinata(formData.image);

      toast({ title: 'Creating metadata...' });
      const attributes = [
        { trait_type: 'Type', value: formData.type },
        { trait_type: 'Rarity', value: formData.rarity },
        ...formData.attributes.map(attr => ({
          trait_type: attr.trait,
          value: attr.value,
        })),
      ];

      const metadata = createNFTMetadata(
        formData.name,
        formData.description,
        imageCID,
        attributes,
        formData.rarity
      );

      const metadataCID = await uploadMetadataToPinata(metadata);

      let tokenId = collectionTokenId;
      if (!tokenId) {
        toast({ title: 'Creating NFT collection...' });
        tokenId = await createNFTCollection(
          hashConnect,
          topic || walletState.topic,
          walletState.account.accountId,
          'Hedera Gamers Vault Collection',
          'HGVC',
          5,
          walletState.account.publicKey
        );
        setCollectionTokenId(tokenId);
      }

      toast({ title: 'Minting NFT...' });
      const serialNumber = await mintNFT(
        hashConnect,
        topic || walletState.topic,
        walletState.account.accountId,
        tokenId,
        metadataCID
      );

      toast({
        title: 'NFT Minted Successfully!',
        description: `Token ID: ${tokenId}, Serial: ${serialNumber}`,
      });

      setFormData({
        name: '',
        description: '',
        type: '',
        rarity: 'Common',
        image: null,
        attributes: [],
      });
      setImagePreview(null);

    } catch (error: any) {
      console.error('Minting error:', error);
      toast({
        title: 'Minting failed',
        description: error.message || 'An error occurred while minting',
        variant: 'destructive',
      });
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Mint Game Collectible
        </CardTitle>
        <CardDescription>
          Create a unique game collectible NFT on Hedera
        </CardDescription>
        <div className="mt-4 flex items-start gap-2 p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            You'll earn <span className="font-semibold text-primary">5% royalty</span> on every resale of this NFT
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleMint} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="image">Collectible Image</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
              {imagePreview ? (
                <div className="relative inline-block">
                  <img src={imagePreview} alt="Preview" className="max-w-xs max-h-64 rounded-lg" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData({ ...formData, image: null });
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div>
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">Drag and drop or click to upload</p>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="max-w-xs mx-auto"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Legendary Sword"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Input
                id="type"
                placeholder="Weapon, Armor, etc."
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your collectible..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rarity">Rarity</Label>
            <Select
              value={formData.rarity}
              onValueChange={(value) => setFormData({ ...formData, rarity: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Common">Common</SelectItem>
                <SelectItem value="Rare">Rare</SelectItem>
                <SelectItem value="Epic">Epic</SelectItem>
                <SelectItem value="Legendary">Legendary</SelectItem>
                <SelectItem value="Mythic">Mythic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Custom Attributes</Label>
              <Button type="button" variant="outline" size="sm" onClick={addAttribute}>
                <Plus className="h-4 w-4 mr-2" />
                Add Attribute
              </Button>
            </div>

            {formData.attributes.map((attr, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Trait (e.g., Damage)"
                  value={attr.trait}
                  onChange={(e) => updateAttribute(index, 'trait', e.target.value)}
                />
                <Input
                  placeholder="Value (e.g., 100)"
                  value={attr.value}
                  onChange={(e) => updateAttribute(index, 'value', e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAttribute(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button type="submit" className="w-full" disabled={isMinting || !formData.image}>
            <Sparkles className="mr-2 h-4 w-4" />
            {isMinting ? 'Minting...' : 'Mint NFT'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MintForm;