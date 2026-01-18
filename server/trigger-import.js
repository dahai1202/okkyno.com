// Direct import trigger for Epic Gardening content
const { EpicGardeningScraperV2 } = require('./epic-scraper-v2.ts');

async function runImport() {
  console.log('Starting Epic Gardening content import...');
  
  try {
    const scraper = new EpicGardeningScraperV2();
    await scraper.fullImport();
    console.log('Import completed successfully!');
  } catch (error) {
    console.error('Import failed:', error);
  }
}

runImport();