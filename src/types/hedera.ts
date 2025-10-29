// Hedera-related types
export interface HederaAccount {
  accountId: string;
  balance: string;
  publicKey?: string;
}

export interface WalletConnectionState {
  isConnected: boolean;
  account: HederaAccount | null;
  topic: string;
  pairingString: string;
}

export interface TokenInfo {
  tokenId: string;
  name: string;
  symbol: string;
  totalSupply: string;
  treasuryAccountId: string;
}
