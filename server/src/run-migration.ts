import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

async function runMigration() {
  console.log('Starting database migration...');

  try {
    // Compile TypeScript migration file
    console.log('Compiling migration...');
    await execPromise(
      'npx tsc src/migrations/001-update-schema.ts --outDir dist/migrations',
    );

    // Run the compiled migration
    console.log('Running migration...');
    await execPromise('node dist/migrations/001-update-schema.js');

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

void runMigration();
