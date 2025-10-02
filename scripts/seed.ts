import { seed } from '../src/lib/db/seed';

async function main() {
  console.log('🌱 Seeding database...');
  
  try {
    await seed();
    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

main();

