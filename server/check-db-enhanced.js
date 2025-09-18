const { Sequelize } = require('sequelize');

// Create a Sequelize instance with the same configuration as in the app
const sequelize = new Sequelize('pingme', 'postgres', '10062003', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  logging: false, // Set to console.log to see SQL queries
});

async function checkDatabase() {
  try {
    // Test the connection
    await sequelize.authenticate();
    console.log('Connection to database has been established successfully.');

    // Check if users table exists and get its structure
    console.log('\n=== USERS TABLE ===');
    try {
      const usersTable = await sequelize.query(
        `
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'users' AND table_schema = 'public'
        ORDER BY ordinal_position
      `,
        { type: sequelize.QueryTypes.SELECT },
      );

      if (usersTable.length > 0) {
        console.log('Users table exists with the following structure:');
        usersTable.forEach((column) => {
          console.log(
            `  ${column.column_name}: ${column.data_type} (nullable: ${column.is_nullable})`,
          );
        });

        // Get sample data from users table
        const usersData = await sequelize.query('SELECT * FROM users', {
          type: sequelize.QueryTypes.SELECT,
        });
        console.log(`\nFound ${usersData.length} users in the table:`);
        usersData.forEach((user) => {
          console.log(
            `  ID: ${user.id}, Username: ${user.username}, Display Name: ${user.display_name}`,
          );
        });
      } else {
        console.log('Users table does not exist or is empty.');
      }
    } catch (error) {
      console.log('Error checking users table:', error.message);
    }

    // Check if conversations table exists and get its structure
    console.log('\n=== CONVERSATIONS TABLE ===');
    try {
      const conversationsTable = await sequelize.query(
        `
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'conversations' AND table_schema = 'public'
        ORDER BY ordinal_position
      `,
        { type: sequelize.QueryTypes.SELECT },
      );

      if (conversationsTable.length > 0) {
        console.log('Conversations table exists with the following structure:');
        conversationsTable.forEach((column) => {
          console.log(
            `  ${column.column_name}: ${column.data_type} (nullable: ${column.is_nullable})`,
          );
        });

        // Get sample data from conversations table
        const conversationsData = await sequelize.query('SELECT * FROM conversations ORDER BY id DESC LIMIT 10', {
          type: sequelize.QueryTypes.SELECT,
        });
        console.log(`\nFound ${conversationsData.length} recent conversations in the table:`);
        conversationsData.forEach((conversation) => {
          console.log(
            `  ID: ${conversation.id}, Name: ${conversation.name}, Is Group: ${conversation.is_group}, Created By: ${conversation.created_by}`,
          );
        });
      } else {
        console.log('Conversations table does not exist or is empty.');
      }
    } catch (error) {
      console.log('Error checking conversations table:', error.message);
    }

    // Check if conversation_participants table exists and get its structure
    console.log('\n=== CONVERSATION PARTICIPANTS TABLE ===');
    try {
      const participantsTable = await sequelize.query(
        `
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'conversation_participants' AND table_schema = 'public'
        ORDER BY ordinal_position
      `,
        { type: sequelize.QueryTypes.SELECT },
      );

      if (participantsTable.length > 0) {
        console.log('Conversation participants table exists with the following structure:');
        participantsTable.forEach((column) => {
          console.log(
            `  ${column.column_name}: ${column.data_type} (nullable: ${column.is_nullable})`,
          );
        });

        // Get sample data from conversation_participants table
        const participantsData = await sequelize.query('SELECT * FROM conversation_participants ORDER BY id DESC LIMIT 20', {
          type: sequelize.QueryTypes.SELECT,
        });
        console.log(`\nFound ${participantsData.length} recent participants in the table:`);
        participantsData.forEach((participant) => {
          console.log(
            `  ID: ${participant.id}, Conversation ID: ${participant.conversation_id}, User ID: ${participant.user_id}, Role: ${participant.role}`,
          );
        });
      } else {
        console.log('Conversation participants table does not exist or is empty.');
      }
    } catch (error) {
      console.log('Error checking conversation participants table:', error.message);
    }

    // Check if messages table exists and get its structure
    console.log('\n=== MESSAGES TABLE ===');
    try {
      const messagesTable = await sequelize.query(
        `
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'messages' AND table_schema = 'public'
        ORDER BY ordinal_position
      `,
        { type: sequelize.QueryTypes.SELECT },
      );

      if (messagesTable.length > 0) {
        console.log('Messages table exists with the following structure:');
        messagesTable.forEach((column) => {
          console.log(
            `  ${column.column_name}: ${column.data_type} (nullable: ${column.is_nullable})`,
          );
        });

        // Get sample data from messages table
        const messagesData = await sequelize.query('SELECT * FROM messages ORDER BY id DESC LIMIT 30', {
          type: sequelize.QueryTypes.SELECT,
        });
        console.log(`\nFound ${messagesData.length} recent messages in the table:`);
        messagesData.forEach((message) => {
          console.log(
            `  ID: ${message.id}, Text: ${message.text}, Sender: ${message.sender_id}, Conversation: ${message.conversation_id}`,
          );
        });
      } else {
        console.log('Messages table does not exist or is empty.');
      }
    } catch (error) {
      console.log('Error checking messages table:', error.message);
    }

    // Check constraints and relationships
    console.log('\n=== CONSTRAINTS ===');
    try {
      const constraints = await sequelize.query(
        `
        SELECT tc.table_name, tc.constraint_name, tc.constraint_type, kcu.column_name
        FROM information_schema.table_constraints tc
        LEFT JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        WHERE tc.table_name IN ('users', 'messages', 'conversations', 'conversation_participants') AND tc.table_schema = 'public'
        ORDER BY tc.table_name, tc.constraint_name
      `,
        { type: sequelize.QueryTypes.SELECT },
      );

      console.log('Constraints found:');
      constraints.forEach((constraint) => {
        console.log(
          `  Table: ${constraint.table_name}, Constraint: ${constraint.constraint_name}, Type: ${constraint.constraint_type}, Column: ${constraint.column_name}`,
        );
      });
    } catch (error) {
      console.log('Error checking constraints:', error.message);
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    await sequelize.close();
  }
}

checkDatabase();