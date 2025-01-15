
import { db } from "@db";
import { carModels } from "@db/schema";

async function checkDatabase() {
  const count = await db.select().from(carModels);
  console.log(`Number of car models in database: ${count.length}`);
  
  if (count.length > 0) {
    console.log('Sample entries:');
    console.log(count.slice(0, 3));
  }
}

checkDatabase().catch(console.error);
