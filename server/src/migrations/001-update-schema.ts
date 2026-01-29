import { Sequelize } from 'sequelize-typescript';
import { config } from 'dotenv';
import * as path from 'path';

// Load environment variables
config({ path: path.resolve(__dirname, '../../.env') });

async function updateSchema() {
  // Database configuration
  const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'ourschat',
    logging: console.log,
  });

  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Start transaction
    const transaction = await sequelize.transaction();

    try {
      // 1. Create conversations table
      await sequelize.query(
        `
        CREATE TABLE IF NOT EXISTS conversations (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255),
          is_group BOOLEAN DEFAULT FALSE,
          created_by INT REFERENCES users(id) ON DELETE SET NULL,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `,
        { transaction },
      );

      // 2. Create conversation_participants table
      await sequelize.query(
        `
        CREATE TABLE IF NOT EXISTS conversation_participants (
          id SERIAL PRIMARY KEY,
          conversation_id INT REFERENCES conversations(id) ON DELETE CASCADE,
          user_id INT REFERENCES users(id) ON DELETE CASCADE,
          role VARCHAR(50) DEFAULT 'member',
          joined_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE(conversation_id, user_id)
        );
      `,
        { transaction },
      );

      // 3. Create message_status table
      await sequelize.query(
        `
        CREATE TABLE IF NOT EXISTS message_status (
          id SERIAL PRIMARY KEY,
          message_id INT REFERENCES messages(id) ON DELETE CASCADE,
          user_id INT REFERENCES users(id) ON DELETE CASCADE,
          status VARCHAR(50) DEFAULT 'sent',
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE(message_id, user_id)
        );
      `,
        { transaction },
      );

      // 4. Add conversation_id column to messages table
      await sequelize.query(
        `
        ALTER TABLE messages 
        ADD COLUMN IF NOT EXISTS conversation_id INT REFERENCES conversations(id) ON DELETE CASCADE;
      `,
        { transaction },
      );

      // 5. Add attachment_url column to messages table
      await sequelize.query(
        `
        ALTER TABLE messages 
        ADD COLUMN IF NOT EXISTS attachment_url VARCHAR(255);
      `,
        { transaction },
      );

      // 6. Remove is_me column from messages table (if it exists)
      await sequelize.query(
        `
        ALTER TABLE messages 
        DROP COLUMN IF EXISTS is_me;
      `,
        { transaction },
      );

      // 7. Remove time column from messages table (if it exists)
      await sequelize.query(
        `
        ALTER TABLE messages 
        DROP COLUMN IF EXISTS time;
      `,
        { transaction },
      );

      // 8. Remove sender_name column from messages table (if it exists)
      await sequelize.query(
        `
        ALTER TABLE messages 
        DROP COLUMN IF EXISTS sender_name;
      `,
        { transaction },
      );

      // 9. Remove receiver_id column from messages table (if it exists)
      await sequelize.query(
        `
        ALTER TABLE messages 
        DROP COLUMN IF EXISTS receiver_id;
      `,
        { transaction },
      );

      // 10. Remove is_group column from messages table (if it exists)
      await sequelize.query(
        `
        ALTER TABLE messages 
        DROP COLUMN IF EXISTS is_group;
      `,
        { transaction },
      );

      // 11. Remove is_group column from users table (if it exists)
      await sequelize.query(
        `
        ALTER TABLE users 
        DROP COLUMN IF EXISTS is_group;
      `,
        { transaction },
      );

      // Commit transaction
      await transaction.commit();
      console.log('Schema updated successfully!');
    } catch (error) {
      // Rollback transaction
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the migration
updateSchema().catch(console.error);
