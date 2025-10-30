import { Button } from "@/components/ui/button";
import { useWalletContext } from "@/contexts/WalletContext";
import { Wallet, Download, ExternalLink } from "lucide-react";
import { QRCodeSVG } from 'qrcode.react';
import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";

export const WalletConnect = () => {
  const { walletState, isConnecting, connectWallet } = useWalletContext();
  const [hasHashPack, setHasHashPack] = useState<boolean | null>(null);

  useEffect(() => {
    const checkHashPack = () => {
      const isInstalled = !!(window as any).hashconnect || !!(window as any).ethereum?.isHashPack;
      setHasHashPack(isInstalled);
    };
    
    checkHashPack();
    setTimeout(checkHashPack, 1000);
  }, []);

  if (walletState.isConnected) {
    return null;
  }

  if (walletState.pairingString && !walletState.isConnected) {
    return (
      <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-background">
        <p className="text-sm font-medium">Scan with HashPack to connect:</p>
        <div className="p-2 bg-white rounded">
          <QRCodeSVG value={walletState.pairingString} size={200} />
        </div>
        <p className="text-xs text-muted-foreground text-center max-w-xs">
          Or copy pairing string and paste in HashPack mobile app
        </p>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4">
      {hasHashPack === false && (
        <Alert className="max-w-md mx-auto">
          <Download className="h-4 w-4" />
          <AlertDescription className="ml-2">
            <p className="font-medium mb-2">HashPack Wallet Not Detected</p>
            <p className="text-sm mb-3">Install HashPack to connect your wallet and trade NFTs</p>
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => window.open('https://www.hashpack.app/download', '_blank')}
            >
              <Download className="h-4 w-4 mr-2" />
              Install HashPack
              <ExternalLink className="h-3 w-3 ml-2" />
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <Button
        onClick={connectWallet}
        disabled={isConnecting || hasHashPack === false}
        size="lg"
        className="flex items-center gap-2"
      >
        <Wallet className="h-5 w-5" />
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>
      <p className="text-xs text-muted-foreground mt-2">
        {hasHashPack === false ? 'Install HashPack to continue' : 'Connect to start trading NFTs'}
      </p>
    </div>
  );
};