// Auto-detect and use appropriate database
// Uses PostgreSQL if DATABASE_URL is set, otherwise SQLite

const usePostgres = !!process.env.DATABASE_URL;

if (usePostgres) {
  console.log('📊 Using PostgreSQL database');
  const pgModule = await import('./database-pg.js');
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
  } = pgModule;
  export default pgModule.default;
} else {
  console.log('📊 Using SQLite database');
  const sqliteModule = await import('./database.js');
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
  } = sqliteModule;
  export default sqliteModule.default;
}
