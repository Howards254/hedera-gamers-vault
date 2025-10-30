// Auto-detect and use appropriate database
// Uses PostgreSQL if DATABASE_URL is set, otherwise SQLite

const usePostgres = !!process.env.DATABASE_URL;

let dbModule;

if (usePostgres) {
  console.log('📊 Using PostgreSQL database');
  dbModule = await import('./database-pg.js');
} else {
  console.log('📊 Using SQLite database');
  dbModule = await import('./database.js');
}

export const {
  createNFTRecord,
  getNFTsByOwner,
  listNFTForSale,
  getListedNFTs,
  purchaseNFT,
  logPayment,
  getFailedPayments,
  createPendingPurchase,
  getPendingPurchases,
  updatePendingPurchaseStatus,
  registerGame,
  updateGameTokenId,
  getGameByApiKey,
  getGamesByDeveloper,
  getAllGames,
  createTemplate,
  getTemplatesByGame,
  getTemplate
} = dbModule;

export default dbModule.default;
