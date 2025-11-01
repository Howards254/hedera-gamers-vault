import 'dotenv/config';
import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function migrate() {
  try {
    // Check if is_listed column exists and migrate to listed_for_sale
    const result = await db.execute('PRAGMA table_info(nfts)');
    const columns = result.rows.map(row => row.name);
    
    if (columns.includes('is_listed')) {
      console.log('Migrating is_listed to listed_for_sale...');
      
      // Copy data from is_listed to listed_for_sale
      await db.execute('UPDATE nfts SET listed_for_sale = is_listed WHERE is_listed IS NOT NULL');
      
      console.log('Migration completed!');
    } else {
      console.log('No is_listed column found, ensuring listed_for_sale has default values...');
    }
    
    // Ensure all NULL values are set to 0
    await db.execute('UPDATE nfts SET listed_for_sale = 0 WHERE listed_for_sale IS NULL');
    
    console.log('All NFTs now have proper listed_for_sale values');
    
    // Show stats
    const stats = await db.execute('SELECT listed_for_sale, COUNT(*) as count FROM nfts GROUP BY listed_for_sale');
    console.log('NFT listing stats:', stats.rows);
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrate();
