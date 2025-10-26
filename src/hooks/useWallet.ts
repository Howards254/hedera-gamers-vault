import { useState, useEffect } from 'react';
import { WalletConnectionState } from '@/types/hedera';
import { HashConnect, HashConnectTypes, MessageTypes } from 'hashconnect';
import { AccountBalanceQuery, Client } from '@hashgraph/sdk';

let hashconnect: HashConnect | null = null;
let appMetadata: HashConnectTypes.AppMetadata = {
  name: 'GamersNFT',
  description: 'Gaming NFT Marketplace on Hedera',
  icon: 'https://absolute.url/to/icon.png',
  url: window.location.origin,
};

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletConnectionState>({
    isConnected: false,
    account: null,
    topic: '',
    pairingString: '',
  });

  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Initialize HashConnect on mount
    initHashConnect();
  }, []);

  const initHashConnect = async () => {
    if (hashconnect) return;

    hashconnect = new HashConnect(
      true, // debug mode
      'testnet',
      appMetadata,
      true
    );

    // Set up pairing event
    hashconnect.pairingEvent.on((pairingData) => {
      console.log('Pairing event:', pairingData);
      handlePairing(pairingData);
    });

    // Set up disconnect event
    hashconnect.disconnectionEvent.on((topic) => {
      console.log('Disconnected from topic:', topic);
      setWalletState({
        isConnected: false,
        account: null,
        topic: '',
        pairingString: '',
      });
    });

    await hashconnect.init();
  };

  const handlePairing = async (pairingData: MessageTypes.ApprovePairing) => {
    const accountId = pairingData.accountIds[0];
    const network = pairingData.network;

    // Fetch balance
    const balance = await getBalance(accountId);

    setWalletState({
      isConnected: true,
      account: {
        accountId,
        balance,
        network,
      },
      topic: pairingData.topic,
      pairingString: '',
    });

    setIsConnecting(false);
  };

  const connectWallet = async () => {
    if (!hashconnect) {
      await initHashConnect();
    }

    setIsConnecting(true);

    try {
      // Check if already paired
      const state = hashconnect!.hcData.pairingData;
      if (state && state.length > 0) {
        // Already paired, just update state
        const pairingData = state[0];
        await handlePairing(pairingData);
        return;
      }

      // Request new pairing
      const initData = await hashconnect!.connect();
      console.log('Pairing string:', initData.pairingString);

      setWalletState((prev) => ({
        ...prev,
        pairingString: initData.pairingString,
      }));

      // Pairing will be handled by the pairingEvent listener
    } catch (error) {
      console.error('Wallet connection error:', error);
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    if (hashconnect && walletState.topic) {
      await hashconnect.disconnect(walletState.topic);
    }

    setWalletState({
      isConnected: false,
      account: null,
      topic: '',
      pairingString: '',
    });
  };

  const getBalance = async (accountId?: string) => {
    if (!accountId && !walletState.account?.accountId) {
      return '0';
    }

    try {
      const client = Client.forTestnet();
      const query = new AccountBalanceQuery()
        .setAccountId(accountId || walletState.account!.accountId);

      const balance = await query.execute(client);
      return balance.hbars.toString();
    } catch (error) {
      console.error('Balance fetch error:', error);
      return '0';
    }
  };

  return {
    walletState,
    isConnecting,
    connectWallet,
    disconnectWallet,
    getBalance,
    hashconnect,
  };
};
