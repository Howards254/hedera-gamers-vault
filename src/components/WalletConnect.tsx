import { Button } from "@/components/ui/button";
import { useWalletContext } from "@/contexts/WalletContext";
import { Wallet, LogOut } from "lucide-react";
import { QRCodeSVG } from 'qrcode.react';

export const WalletConnect = () => {
  const { walletState, isConnecting, connectWallet } = useWalletContext();

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
    <div className="text-center">
      <Button
        onClick={connectWallet}
        disabled={isConnecting}
        size="lg"
        className="flex items-center gap-2"
      >
        <Wallet className="h-5 w-5" />
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>
      <p className="text-xs text-muted-foreground mt-2">Connect to start trading NFTs</p>
    </div>
  );
};