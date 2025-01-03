import { db } from "@db";
import { carModels } from "@db/schema";
import fs from "fs";
import { eq } from "drizzle-orm";

async function importCarModels() {
  const sqlFile = fs.readFileSync('attached_assets/Car-Models-List-by-Teoalida-Worldwide-version (1).sql', 'utf-8');
  
  // Parse the SQL file to extract INSERT statements
  const insertRegex = /INSERT INTO.*VALUES\s*\((.*?)\)/gm;
  const matches = sqlFile.matchAll(insertRegex);
  
  for (const match of matches) {
    const values = match[1].split(',').map(v => v.trim().replace(/^'|'$/g, ''));
    
    // Skip header or invalid rows
    if (!values[0] || values[0] === 'Make') continue;
    
    try {
      await db.insert(carModels).values({
        make: values[0],
        model: values[1] || '',
        platform: values[2] || null,
        classification: values[3] || null,
        productionYears: values[4] || null,
        countryOfOrigin: values[7] || null,
        unitsProduced: values[11] || null,
        notes: values[12] || null,
      });
      
      console.log(`Imported: ${values[0]} ${values[1]}`);
    } catch (error) {
      console.error(`Failed to import ${values[0]} ${values[1]}:`, error);
    }
  }
  
  console.log('Import completed!');
}

importCarModels().catch(console.error);
