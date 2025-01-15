import { db } from "@db";
import { carModels } from "@db/schema";
import fs from "fs";

const BATCH_SIZE = 100;

async function importCarModels() {
  console.log('Starting import process...');
  try {
    const sqlFile = fs.readFileSync('attached_assets/Car-Models-List-by-Teoalida-Worldwide-version.sql', 'utf-8');
    console.log('SQL file loaded successfully');

    // Extract INSERT statements
    const insertRegex = /INSERT INTO[^;]+;/g;
    const insertStatements = sqlFile.match(insertRegex) || [];

    if (insertStatements.length === 0) {
      throw new Error('No INSERT statements found');
    }

    console.log(`Found ${insertStatements.length} insert statements`);

    // Clear existing data
    await db.delete(carModels);
    console.log('Cleared existing data');

    let totalRecords = 0;
    let batch: any[] = [];

    for (const statement of insertStatements) {
      const valuesMatch = statement.match(/\(((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*)\)/g);
      if (!valuesMatch) continue;

      for (const valueStr of valuesMatch) {
        const values = valueStr
          .slice(1, -1)
          .split(',')
          .map(v => {
            const trimmed = v.trim();
            if (trimmed === 'NULL' || trimmed === '') return null;
            return trimmed.replace(/^'|'$/g, '').replace(/''/g, "'");
          });

        const record = {
          make: values[0] || '',
          model: values[1] || '',
          platform: values[2] || null,
          classification: values[3] || null,
          productionYears: values[4] || null,
          countryOfOrigin: values[7] || null,
          unitsProduced: values[11] || null,
          notes: values[12] || null,
        };

        batch.push(record);

        if (batch.length >= BATCH_SIZE) {
          await db.insert(carModels).values(batch);
          totalRecords += batch.length;
          console.log(`Imported ${totalRecords} records...`);
          batch = [];
        }
      }
    }

    // Insert remaining records
    if (batch.length > 0) {
      await db.insert(carModels).values(batch);
      totalRecords += batch.length;
    }

    console.log(`Import completed! Total records imported: ${totalRecords}`);

  } catch (error) {
    console.error('Import failed:', error);
  }
}

importCarModels().catch(console.error);