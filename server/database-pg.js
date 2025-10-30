import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize tables
async function initDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS games (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        developer_account_id TEXT NOT NULL,
        api_key TEXT UNIQUE NOT NULL,
        token_id TEXT,
        royalty_percentage REAL DEFAULT 5.0,
        logo_url TEXT,
        website_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS nft_templates (
        id SERIAL PRIMARY KEY,
        game_id INTEGER NOT NULL REFERENCES games(id),
        template_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        type TEXT,
        rarity TEXT,
        attributes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(game_id, template_id)
      );

      CREATE TABLE IF NOT EXISTS nfts (
        id SERIAL PRIMARY KEY,
        token_id TEXT NOT NULL,
        serial_number INTEGER NOT NULL,
        owner_account_id TEXT NOT NULL,
        metadata_cid TEXT NOT NULL,
        game_id INTEGER REFERENCES games(id),
        template_id TEXT,
        listed_for_sale INTEGER DEFAULT 0,
        price REAL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        nft_id INTEGER NOT NULL REFERENCES nfts(id),
        from_account TEXT NOT NULL,
        to_account TEXT NOT NULL,
        price REAL NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS payment_logs (
        id SERIAL PRIMARY KEY,
        nft_id INTEGER NOT NULL REFERENCES nfts(id),
        buyer_account_id TEXT NOT NULL,
        seller_account_id TEXT NOT NULL,
        amount REAL NOT NULL,
        status TEXT NOT NULL,
        payment_tx_id TEXT,
        forward_tx_id TEXT,
        error_message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS pending_purchases (
        id SERIAL PRIMARY KEY,
        nft_id INTEGER NOT NULL REFERENCES nfts(id),
        buyer_account_id TEXT NOT NULL,
        expected_amount REAL NOT NULL,
        status TEXT DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ PostgreSQL database initialized');
  } finally {
    client.release();
  }
}

export async function createNFTRecord(tokenId, serialNumber, ownerAccountId, metadataCID) {
  const result = await pool.query(
    'INSERT INTO nfts (token_id, serial_number, owner_account_id, metadata_cid) VALUES ($1, $2, $3, $4) RETURNING id',
    [tokenId, serialNumber, ownerAccountId, metadataCID]
  );
  return result.rows[0].id;
}

export async function getNFTsByOwner(ownerAccountId) {
  const result = await pool.query(
    'SELECT * FROM nfts WHERE owner_account_id = $1 ORDER BY created_at DESC',
    [ownerAccountId]
  );
  return result.rows;
}

export async function listNFTForSale(nftId, price, ownerAccountId) {
  await pool.query(
    'UPDATE nfts SET listed_for_sale = 1, price = $1 WHERE id = $2 AND owner_account_id = $3',
    [price, nftId, ownerAccountId]
  );
}

export async function getListedNFTs() {
  const result = await pool.query(
    'SELECT * FROM nfts WHERE listed_for_sale = 1 ORDER BY created_at DESC'
  );
  return result.rows;
}

export async function purchaseNFT(nftId, buyerAccountId) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const nftResult = await client.query('SELECT * FROM nfts WHERE id = $1', [nftId]);
    const nft = nftResult.rows[0];
    
    if (!nft || !nft.listed_for_sale) {
      throw new Error('NFT not available for purchase');
    }

    await client.query(
      'UPDATE nfts SET owner_account_id = $1, listed_for_sale = 0, price = 0 WHERE id = $2',
      [buyerAccountId, nftId]
    );

    await client.query(
      'INSERT INTO transactions (nft_id, from_account, to_account, price) VALUES ($1, $2, $3, $4)',
      [nftId, nft.owner_account_id, buyerAccountId, nft.price]
    );

    await client.query('COMMIT');
    return { seller: nft.owner_account_id, price: nft.price };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function logPayment(nftId, buyerAccountId, sellerAccountId, amount, status, paymentTxId = null, forwardTxId = null, errorMessage = null) {
  const result = await pool.query(
    'INSERT INTO payment_logs (nft_id, buyer_account_id, seller_account_id, amount, status, payment_tx_id, forward_tx_id, error_message) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
    [nftId, buyerAccountId, sellerAccountId, amount, status, paymentTxId, forwardTxId, errorMessage]
  );
  return result.rows[0].id;
}

export async function getFailedPayments() {
  const result = await pool.query(
    "SELECT * FROM payment_logs WHERE status IN ('PAYMENT_RECEIVED', 'FORWARD_FAILED') ORDER BY created_at DESC"
  );
  return result.rows;
}

export async function createPendingPurchase(nftId, buyerAccountId, expectedAmount) {
  const result = await pool.query(
    'INSERT INTO pending_purchases (nft_id, buyer_account_id, expected_amount) VALUES ($1, $2, $3) RETURNING id',
    [nftId, buyerAccountId, expectedAmount]
  );
  return result.rows[0].id;
}

export async function getPendingPurchases() {
  const result = await pool.query(
    "SELECT * FROM pending_purchases WHERE status = 'PENDING' AND created_at > NOW() - INTERVAL '10 minutes' ORDER BY created_at ASC"
  );
  return result.rows;
}

export async function updatePendingPurchaseStatus(id, status) {
  await pool.query('UPDATE pending_purchases SET status = $1 WHERE id = $2', [status, id]);
}

// Game functions
export async function registerGame(name, description, developerAccountId, royaltyPercentage, logoUrl, websiteUrl) {
  const apiKey = 'gn_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const result = await pool.query(
    'INSERT INTO games (name, description, developer_account_id, api_key, royalty_percentage, logo_url, website_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
    [name, description, developerAccountId, apiKey, royaltyPercentage || 5.0, logoUrl, websiteUrl]
  );
  return { gameId: result.rows[0].id, apiKey };
}

export async function updateGameTokenId(gameId, tokenId) {
  await pool.query('UPDATE games SET token_id = $1 WHERE id = $2', [tokenId, gameId]);
}

export async function getGameByApiKey(apiKey) {
  const result = await pool.query('SELECT * FROM games WHERE api_key = $1', [apiKey]);
  return result.rows[0];
}

export async function getGamesByDeveloper(developerAccountId) {
  const result = await pool.query(
    'SELECT * FROM games WHERE developer_account_id = $1 ORDER BY created_at DESC',
    [developerAccountId]
  );
  return result.rows;
}

export async function getAllGames() {
  const result = await pool.query('SELECT * FROM games ORDER BY created_at DESC');
  return result.rows;
}

// Template functions
export async function createTemplate(gameId, templateId, name, description, imageUrl, type, rarity, attributes) {
  const result = await pool.query(
    'INSERT INTO nft_templates (game_id, template_id, name, description, image_url, type, rarity, attributes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
    [gameId, templateId, name, description, imageUrl, type, rarity, JSON.stringify(attributes)]
  );
  return result.rows[0].id;
}

export async function getTemplatesByGame(gameId) {
  const result = await pool.query(
    'SELECT * FROM nft_templates WHERE game_id = $1 ORDER BY created_at DESC',
    [gameId]
  );
  return result.rows.map(t => ({ ...t, attributes: JSON.parse(t.attributes || '{}') }));
}

export async function getTemplate(gameId, templateId) {
  const result = await pool.query(
    'SELECT * FROM nft_templates WHERE game_id = $1 AND template_id = $2',
    [gameId, templateId]
  );
  const template = result.rows[0];
  if (template) template.attributes = JSON.parse(template.attributes || '{}');
  return template;
}

// Initialize on import
initDatabase().catch(console.error);

export default pool;
