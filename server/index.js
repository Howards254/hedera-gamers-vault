import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createNFTCollection, mintNFT } from './nft-service.js';
import { createNFTRecord, getNFTsByOwner, listNFTForSale, getListedNFTs, purchaseNFT, registerGame, getGameByApiKey, getGamesByDeveloper, getAllGames, createTemplate, getTemplatesByGame, getTemplate, updateGameTokenId, logPayment, getFailedPayments, createPendingPurchase } from './database.js';
import { startPaymentProcessor } from './payment-processor.js';
import db from './database.js';
import { verifyPayment, forwardPaymentToSeller } from './payment-verification.js';

console.log('Platform Account:', process.env.VITE_MY_ACCOUNT_ID);

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/create-collection', async (req, res) => {
  try {
    const { name, symbol } = req.body;
    const tokenId = await createNFTCollection(name, symbol);
    res.json({ tokenId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/mint-nft', async (req, res) => {
  try {
    const { tokenId, metadataCID, recipientAccountId } = req.body;
    const serialNumber = await mintNFT(tokenId, metadataCID, recipientAccountId);
    createNFTRecord(tokenId, serialNumber, recipientAccountId, metadataCID);
    res.json({ serialNumber });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/my-nfts/:accountId', async (req, res) => {
  try {
    const { accountId } = req.params;
    const nfts = getNFTsByOwner(accountId);
    res.json({ nfts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/list-nft', async (req, res) => {
  try {
    const { nftId, price, ownerAccountId } = req.body;
    listNFTForSale(nftId, price, ownerAccountId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/marketplace', async (req, res) => {
  try {
    const nfts = getListedNFTs();
    res.json({ nfts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/verify-and-purchase', async (req, res) => {
  let paymentLogId = null;
  try {
    const { nftId, buyerAccountId } = req.body;
    
    // Get NFT details to verify payment
    const nft = getListedNFTs().find(n => n.id === nftId);
    if (!nft) {
      return res.status(404).json({ error: 'NFT not found' });
    }
    
    // Verify payment on blockchain
    const verification = await verifyPayment(buyerAccountId, nft.owner_account_id, nft.price);
    
    if (!verification.verified) {
      logPayment(nftId, buyerAccountId, nft.owner_account_id, nft.price, 'VERIFICATION_FAILED', null, null, 'Payment not found on blockchain');
      return res.status(400).json({ error: 'Payment not verified. Please ensure you sent the correct amount.' });
    }
    
    // Log payment received
    paymentLogId = logPayment(nftId, buyerAccountId, nft.owner_account_id, nft.price, 'PAYMENT_RECEIVED', verification.transactionId);
    
    // Get game info for royalty
    const game = db.prepare('SELECT * FROM games WHERE id = ?').get(nft.game_id);
    const royaltyPercentage = game?.royalty_percentage || 0;
    const developerAccountId = game?.developer_account_id;
    
    // Forward payment to seller (minus platform fee and royalty)
    const forwardResult = await forwardPaymentToSeller(nft.owner_account_id, nft.price, royaltyPercentage, developerAccountId);
    
    if (!forwardResult.success) {
      db.prepare('UPDATE payment_logs SET status = "FORWARD_FAILED", error_message = ? WHERE id = ?')
        .run(forwardResult.error, paymentLogId);
      return res.status(500).json({ error: 'Payment verified but failed to forward to seller. Support will refund you.' });
    }
    
    // Update log with forward transaction
    db.prepare('UPDATE payment_logs SET forward_tx_id = ? WHERE id = ?')
      .run(forwardResult.transactionId, paymentLogId);
    
    // Transfer ownership
    const { seller, price } = purchaseNFT(nftId, buyerAccountId);
    
    // Mark as completed
    db.prepare('UPDATE payment_logs SET status = "COMPLETED" WHERE id = ?').run(paymentLogId);
    
    res.json({ 
      success: true, 
      seller, 
      price,
      paymentTransactionId: verification.transactionId,
      forwardTransactionId: forwardResult.transactionId,
      sellerReceived: forwardResult.sellerAmount
    });
  } catch (error) {
    if (paymentLogId) {
      db.prepare('UPDATE payment_logs SET status = "ERROR", error_message = ? WHERE id = ?')
        .run(error.message, paymentLogId);
    }
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/failed-payments', async (req, res) => {
  try {
    const failedPayments = getFailedPayments();
    res.json({ payments: failedPayments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Game Developer API
app.post('/api/v1/games/register', async (req, res) => {
  try {
    const { name, description, developerAccountId, royaltyPercentage, logoUrl, websiteUrl } = req.body;
    const result = registerGame(name, description, developerAccountId, royaltyPercentage, logoUrl, websiteUrl);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/v1/games', async (req, res) => {
  try {
    const games = getAllGames();
    res.json({ games });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/v1/games/my-games/:developerAccountId', async (req, res) => {
  try {
    const { developerAccountId } = req.params;
    const games = getGamesByDeveloper(developerAccountId);
    res.json({ games });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/v1/games/:gameId/templates', async (req, res) => {
  try {
    const { gameId } = req.params;
    const { apiKey, name, description, imageUrl, type, rarity, attributes } = req.body;
    
    const game = getGameByApiKey(apiKey);
    if (!game || game.id !== parseInt(gameId)) {
      return res.status(401).json({ error: 'Invalid API key' });
    }
    
    // Auto-generate template ID from name
    const templateId = name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
    
    const id = createTemplate(gameId, templateId, name, description, imageUrl, type, rarity, attributes);
    res.json({ success: true, templateId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/v1/games/:gameId/templates', async (req, res) => {
  try {
    const { gameId } = req.params;
    const templates = getTemplatesByGame(gameId);
    res.json({ templates });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/v1/games/:gameId/mint', async (req, res) => {
  try {
    const { gameId } = req.params;
    const { apiKey, playerAccountId, templateId, metadata } = req.body;
    
    const game = getGameByApiKey(apiKey);
    if (!game || game.id !== parseInt(gameId)) {
      return res.status(401).json({ error: 'Invalid API key' });
    }
    
    const template = getTemplate(gameId, templateId);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    // Merge template with custom metadata
    const fullMetadata = {
      name: template.name,
      description: template.description,
      image: template.image_url,
      type: template.rarity,
      attributes: { ...template.attributes, ...metadata }
    };
    
    // Upload metadata to IPFS
    const metadataResponse = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.VITE_PINATA_JWT}`
      },
      body: JSON.stringify({ pinataContent: fullMetadata })
    });
    const { IpfsHash: metadataCID } = await metadataResponse.json();
    
    // Create collection if not exists, then mint NFT
    let tokenId = game.token_id;
    if (!tokenId) {
      tokenId = await createNFTCollection(game.name, game.name.substring(0, 4).toUpperCase());
      updateGameTokenId(game.id, tokenId);
    }
    
    const serialNumber = await mintNFT(tokenId, metadataCID, playerAccountId);
    const nftId = createNFTRecord(tokenId, serialNumber, playerAccountId, metadataCID);
    
    res.json({ 
      success: true, 
      nftId,
      serialNumber,
      metadataCID
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/initiate-purchase', async (req, res) => {
  try {
    const { nftId, buyerAccountId } = req.body;
    
    const nft = getListedNFTs().find(n => n.id === nftId);
    if (!nft) {
      return res.status(404).json({ error: 'NFT not found' });
    }
    
    const purchaseId = createPendingPurchase(nftId, buyerAccountId, nft.price);
    
    res.json({ 
      success: true, 
      purchaseId,
      message: 'Purchase initiated. System will automatically verify payment within 10 seconds.'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/purchase-status/:purchaseId', async (req, res) => {
  try {
    const { purchaseId } = req.params;
    const purchase = db.prepare('SELECT * FROM pending_purchases WHERE id = ?').get(purchaseId);
    
    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }
    
    res.json({ status: purchase.status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log('NFT service running on port 3001');
  startPaymentProcessor();
});}
