import fs from 'fs';
import { db } from '../db';
import { carModels } from '../db/schema';
import { sql } from 'drizzle-orm';

async function importCarData() {
  try {
    console.log('Starting car data import process...');

    // Clear existing data
    console.log('Clearing existing car data...');
    await db.execute(sql`TRUNCATE TABLE ${carModels}`);
    console.log('Existing data cleared successfully');

    // Read the car-type-database file
    console.log('Reading car data file...');
    const data = fs.readFileSync('attached_assets/car-type-database', 'utf8');

    // Extract the INSERT statements
    const insertLines = data
      .split('\n')
      .filter(line => line.trim().startsWith('(\''))
      .map(line => {
        // Extract make and model from the line
        const match = line.match(/^\('([^']+)',\s*'([^']+)'/);
        if (match) {
          return {
            make: match[1],
            model: match[2]
          };
        }
        return null;
      })
      .filter(Boolean);

    console.log(`Found ${insertLines.length} car models to import`);

    // Insert the data into PostgreSQL in batches
    const batchSize = 100;
    for (let i = 0; i < insertLines.length; i += batchSize) {
      const batch = insertLines.slice(i, i + batchSize);
      await db.insert(carModels).values(batch);
      console.log(`Imported batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(insertLines.length / batchSize)}`);
    }

    console.log(`Successfully imported ${insertLines.length} car models`);
  } catch (error) {
    console.error('Error importing car data:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

importCarData();