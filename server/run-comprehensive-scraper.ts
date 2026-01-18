import { ComprehensiveEpicScraper } from './comprehensive-epic-scraper';

async function runComprehensiveScraper() {
  console.log('Starting comprehensive Epic Gardening content import...');
  
  try {
    const scraper = new ComprehensiveEpicScraper();
    await scraper.fullScrapeAndImport();
    console.log('Comprehensive import completed successfully!');
  } catch (error) {
    console.error('Comprehensive import failed:', error);
  }
}

// Run the scraper
runComprehensiveScraper();