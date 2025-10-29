import React, { useEffect } from 'react';
import { useWallet } from '../hooks/useWallet'; // Adjust path as needed
// You'll need a QR code library to render the pairing string
// npm install qrcode.react
import { QRCodeSVG } from 'qrcode.react';

/**
 * A simple component to test the useWallet hook.
 */
export const WalletTestComponent: React.FC = () => {
  const {
    walletState,
    isConnecting,
    connectWallet,
    disconnectWallet,
    getBalance,
  } = useWallet();

  const { isConnected, account, pairingString } = walletState;

  useEffect(() => {
    // Optional: Refetch balance every 30 seconds
    if (isConnected) {
      const interval = setInterval(() => {
        console.log("Refreshing balance...");
        getBalance();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [isConnected, getBalance]);

  const handleConnect = () => {
    if (!isConnected) {
      connectWallet();
    }
  };

  const handleDisconnect = () => {
    if (isConnected) {
      disconnectWallet();
    }
  };

  const handleRefreshBalance = () => {
    if (isConnected) {
      getBalance();
    }
  };

  return (
    <div style={{
      fontFamily: 'sans-serif',
      padding: '2rem',
      maxWidth: '600px',
      margin: '2rem auto',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      textAlign: 'center',
      backgroundColor: '#f9f9f9',
    }}>
      <h2 style={{ color: '#333' }}>Hedera Gamers Vault</h2>
      <h3 style={{ color: '#555' }}>Wallet Connection Test</h3>

      {isConnecting && (
        <div style={{ padding: '1rem', color: '#007bff' }}>
          <p>Connecting... Please check HashPack.</p>
        </div>
      )}

      {!isConnected && !isConnecting && !pairingString && (
        <button
          onClick={handleConnect}
          style={buttonStyle}
        >
          Connect Wallet
        </button>
      )}

      {pairingString && !isConnected && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p>Scan with HashPack to connect:</p>
          <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <QRCodeSVG value={pairingString} size={256} />
          </div>
          <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '1rem' }}>
            Or copy pairing string:
            <br />
            <code style={{ wordBreak: 'break-all', display: 'block', padding: '0.5rem', background: '#eee', borderRadius: '4px' }}>
              {pairingString}
            </code>
          </p>
        </div>
      )}

      {isConnected && account && (
        <div style={{
          padding: '1rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
          <p style={{ color: 'green', fontWeight: 'bold' }}>Wallet Connected!</p>
          <p><strong>Account ID:</strong> {account.accountId}</p>
          <p><strong>Balance:</strong> {parseFloat(account.balance).toFixed(4)} HBAR</p>
          <p style={{ fontSize: '0.8rem', color: '#666', wordBreak: 'break-all' }}>
            <strong>Public Key:</strong> {account.publicKey || 'N/A'}
          </p>

          <button
            onClick={handleRefreshBalance}
            style={{ ...buttonStyle, backgroundColor: '#007bff', marginRight: '0.5rem' }}
            disabled={isConnecting}
          >
            {isConnecting ? 'Refreshing...' : 'Refresh Balance'}
          </button>

          <button
            onClick={handleDisconnect}
            style={{ ...buttonStyle, backgroundColor: '#dc3545' }}
          >
            Disconnect Wallet
          </button>
        </div>
      )}
    </div>
  );
};

// Simple button styling
const buttonStyle: React.CSSProperties = {
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  padding: '0.75rem 1.5rem',
  borderRadius: '6px',
  fontSize: '1rem',
  cursor: 'pointer',
  fontWeight: 'bold',
  transition: 'background-color 0.2s ease',
};