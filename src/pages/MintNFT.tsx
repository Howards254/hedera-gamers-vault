import Navigation from '@/components/Navigation';
import MintForm from '@/components/MintForm';
import { useWallet } from '@/hooks/useWallet';
import { Wallet, Sparkles } from 'lucide-react';

const MintNFT = () => {
  const { walletState } = useWallet();

  if (!walletState.isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-md mx-auto space-y-4">
            <Wallet className="h-20 w-20 mx-auto text-muted-foreground" />
            <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
            <p className="text-muted-foreground">
              Please connect your HashPack wallet to mint NFTs
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
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3 justify-center">
            <Sparkles className="h-10 w-10 text-primary" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Mint NFT
            </span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Create your unique game collectible on Hedera
          </p>
        </div>

        {/* Mint Form */}
        <div className="max-w-2xl mx-auto">
          <MintForm />
        </div>

        {/* Info Section */}
        <div className="max-w-2xl mx-auto mt-12 p-6 rounded-lg bg-muted/50 border border-border">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            About Minting
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Your collectible will be minted as a unique NFT on Hedera</li>
            <li>• Metadata is stored on IPFS following the HIP-412 standard</li>
            <li>• You'll automatically receive royalties on all future sales</li>
            <li>• Minting is fast and low-cost thanks to Hedera's technology</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MintNFT;
