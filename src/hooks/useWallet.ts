import { useState, useEffect, useRef } from 'react';
import { HashConnect } from 'hashconnect';
import { LedgerId, AccountBalanceQuery, AccountId, Client } from '@hashgraph/sdk';

interface HederaAccount {
  accountId: string;
  balance: string;
  publicKey?: string;
}

interface WalletConnectionState {
  isConnected: boolean;
  account: HederaAccount | null;
  topic: string;
  pairingString: string;
}

const initialState: WalletConnectionState = {
  isConnected: false,
  account: null,
  topic: '',
  pairingString: '',
};

const appMetadata = {
  name: "Hedera Gamers Vault",
  description: "An NFT marketplace for gamers on Hedera.",
  icons: ["https://www.hedera.com/platform/images/hedera-logo-gradient-black-600x600.png"],
  url: typeof window !== 'undefined' ? window.location.origin : "http://localhost:8080",
};

// Global state shared across all hook instances
let globalHashConnect: HashConnect | null = null;
let globalWalletState: WalletConnectionState = initialState;
let isInitializing = false;
const stateListeners: Set<(state: WalletConnectionState) => void> = new Set();

const updateGlobalState = (newState: WalletConnectionState) => {
  globalWalletState = newState;
  stateListeners.forEach(listener => listener(newState));
};

export const useWallet = () => {
  const [hashConnect, setHashConnect] = useState<HashConnect | null>(globalHashConnect);
  const [walletState, setWalletState] = useState(globalWalletState);
  const [isConnecting, setIsConnecting] = useState(false);
  const initStarted = useRef(false);

  useEffect(() => {
    // Subscribe to global state changes
    const listener = (newState: WalletConnectionState) => {
      setWalletState(newState);
    };
    stateListeners.add(listener);
    
    return () => {
      stateListeners.delete(listener);
    };
  }, []);

  const getHBarBalance = async (accountId: string): Promise<string> => {
    try {
      const client = Client.forTestnet();
      const query = new AccountBalanceQuery().setAccountId(AccountId.fromString(accountId));
      const balance = await query.execute(client);
      return balance.hbars.toString();
    } catch {
      return "0";
    }
  };

  const initializeHashConnect = async () => {
    if (initStarted.current || globalHashConnect || isInitializing) {
      if (globalHashConnect) {
        setHashConnect(globalHashConnect);
        setWalletState(globalWalletState);
      }
      return;
    }
    
    initStarted.current = true;
    isInitializing = true;

    try {
      const hc = new HashConnect(
        LedgerId.TESTNET,
        import.meta.env.VITE_PROJECT_ID || "hedera-gamers-vault-dapp",
        appMetadata,
        false
      );
      
      (hc as any).pairingEvent.on(async (pairingData: any) => {
        if (pairingData.accountIds?.[0]) {
          const accountId = pairingData.accountIds[0];
          const balance = await getHBarBalance(accountId);
          
          const newState = {
            isConnected: true,
            topic: pairingData.topic || '',
            pairingString: '',
            account: { accountId, balance, publicKey: pairingData.metadata?.publicKey },
          };
          
          updateGlobalState(newState);
        }
        setIsConnecting(false);
      });

      (hc as any).disconnectionEvent.on(() => {
        updateGlobalState(initialState);
      });

      await (hc as any).init();
      
      const pairingsData = (hc as any).pairingsData || [];
      
      if (pairingsData.length > 0) {
        const pairing = pairingsData[0];
        const accountId = pairing.accountIds?.[0];
        
        if (accountId) {
          const balance = await getHBarBalance(accountId);
          
          const newState = {
            isConnected: true,
            topic: pairing.topic || '',
            pairingString: '',
            account: { accountId, balance, publicKey: pairing.metadata?.publicKey },
          };
          
          updateGlobalState(newState);
        }
      }

      globalHashConnect = hc;
      setHashConnect(hc);
    } catch (error) {
      console.error("HashConnect init failed:", error);
      setIsConnecting(false);
    } finally {
      isInitializing = false;
    }
  };

  const connectWallet = () => {
    const hc = hashConnect || globalHashConnect;
    if (!hc) return;
    setIsConnecting(true);
    (hc as any).openPairingModal();
  };

  const disconnectWallet = () => {
    const hc = hashConnect || globalHashConnect;
    if (hc && walletState.topic) {
      (hc as any).disconnect(walletState.topic);
    }
    updateGlobalState(initialState);
  };

  const getBalance = async (): Promise<string> => {
    if (!walletState.account?.accountId) return "0";
    const balance = await getHBarBalance(walletState.account.accountId);
    
    const newState = {
      ...globalWalletState,
      account: globalWalletState.account ? { ...globalWalletState.account, balance } : null,
    };
    
    updateGlobalState(newState);
    return balance;
  };

  useEffect(() => {
    initializeHashConnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    walletState,
    isConnecting,
    connectWallet,
    disconnectWallet,
    getBalance,
    hashConnect: hashConnect || globalHashConnect,
    topic: walletState.topic,
  };
};