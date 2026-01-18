
import { ComprehensiveEpicCloner } from './comprehensive-epic-clone';

async function runEpicClone() {
  console.log('Starting Epic Gardening comprehensive content cloning...');
  
  try {
    const cloner = new ComprehensiveEpicCloner();
    await cloner.fullClone();
    
    console.log('Epic Gardening content cloning completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Epic Gardening cloning failed:', error);
    process.exit(1);
  }
}

// Run the cloner
runEpicClone();
