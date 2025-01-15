import fs from 'fs';
import { db } from '../db';
import { carModels } from '../db/schema';

async function importCarData() {
  try {
    // Read the car-type-database file
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

    // Insert the data into PostgreSQL
    for (const car of insertLines) {
      await db.insert(carModels).values({
        make: car.make,
        model: car.model
      });
    }

    console.log(`Successfully imported ${insertLines.length} car models`);
  } catch (error) {
    console.error('Error importing car data:', error);
  }
}

importCarData();
