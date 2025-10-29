import { createContext, useContext, ReactNode } from 'react';
import { useWallet } from '@/hooks/useWallet';

interface WalletContextType {
  walletState: {
    isConnected: boolean;
    account: { accountId: string; balance: string; publicKey?: string } | null;
    topic: string;
    pairingString: string;
  };
  isConnecting: boolean;
  connectWallet: () => void;
  disconnectWallet: () => void;
  getBalance: () => Promise<string>;
  hashConnect: any;
  topic: string;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const wallet = useWallet();
  
  return (
    <WalletContext.Provider value={wallet}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletContext must be used within WalletProvider');
  }
  return context;
};