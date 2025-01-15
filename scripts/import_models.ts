import { db } from "@db";
import { carModels } from "@db/schema";
import fs from "fs";

const BATCH_SIZE = 10; // Very small batch size to prevent timeouts
const MAX_RETRIES = 3;

async function importCarModels() {
  console.log('Starting import process...');
  const sqlFile = fs.readFileSync('attached_assets/Car-Models-List-by-Teoalida-Worldwide-version (1).sql', 'utf-8');

  // Skip SQL header comments and table creation
  const insertStart = sqlFile.indexOf('INSERT INTO');
  if (insertStart === -1) {
    throw new Error('No INSERT statements found in SQL file');
  }

  const insertContent = sqlFile.slice(insertStart);
  const valuesRegex = /\(((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*)\)/g;
  const matches = Array.from(insertContent.matchAll(valuesRegex));

  let count = 0;
  let errors = 0;
  let batch = [];
  let retryCount = 0;

  console.log(`Found ${matches.length} total records to import`);

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const values = match[1]
      .split(',')
      .map(v => v.trim())
      .map(v => {
        if (v === 'NULL' || v === '') return null;
        return v.replace(/^'|'$/g, '').replace(/''/g, "'");
      });

    // Skip if no make or model
    if (!values[0] || values[0] === 'Make') continue;

    try {
      const record = {
        make: values[0],
        model: values[1] || '',
        platform: values[2] || null,
        classification: values[3] || null,
        productionYears: values[4] || null,
        countryOfOrigin: values[7] || null,
        unitsProduced: values[11] || null,
        notes: values[12] || null,
      };

      batch.push(record);

      // Process batch when it reaches BATCH_SIZE or it's the last item
      if (batch.length === BATCH_SIZE || i === matches.length - 1) {
        let success = false;
        while (!success && retryCount < MAX_RETRIES) {
          try {
            await db.transaction(async (tx) => {
              await tx.insert(carModels).values(batch);
            });
            count += batch.length;
            console.log(`Imported ${count}/${matches.length} models...`);
            success = true;
            retryCount = 0;
          } catch (error) {
            retryCount++;
            if (retryCount >= MAX_RETRIES) {
              console.error(`Failed to import batch after ${MAX_RETRIES} retries. Starting with ${batch[0].make} ${batch[0].model}:`, error);
              errors += batch.length;
              break;
            }
            console.log(`Retry ${retryCount}/${MAX_RETRIES} for current batch...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // Exponential backoff
          }
        }
        batch = [];
      }
    } catch (error) {
      console.error(`Error processing record ${values[0]} ${values[1]}:`, error);
      errors++;
    }
  }

  console.log(`Import completed!`);
  console.log(`Successfully imported ${count} models`);
  if (errors > 0) {
    console.log(`Failed to import ${errors} models`);
  }
}

// Clear existing data before import
async function clearExistingData() {
  console.log('Clearing existing car models...');
  try {
    await db.delete(carModels);
    console.log('Existing data cleared successfully');
  } catch (error) {
    console.error('Error clearing existing data:', error);
    throw error;
  }
}

// Run the import process
clearExistingData()
  .then(() => importCarModels())
  .catch(console.error);