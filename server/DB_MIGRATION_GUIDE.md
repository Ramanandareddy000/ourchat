# Database Schema Migration Guide

This document explains how to migrate the existing database schema to the new design that supports both direct messages and group chats.

## Overview of Changes

The new schema introduces several improvements:

1. **Conversations Table**: All chats (both direct and group) are now represented as conversations
2. **Conversation Participants Table**: Tracks which users belong to which conversations
3. **Message Status Table**: Tracks read receipts and delivery status
4. **Updated Messages Table**: Messages now reference conversations instead of individual users

## Migration Steps

### 1. Run the Migration Script

```bash
npm run migrate
```

This script will:
- Create the new `conversations`, `conversation_participants`, and `message_status` tables
- Add new columns to existing tables
- Remove deprecated columns

### 2. Update Existing Data

After running the migration, you'll need to populate the new tables with data from the existing schema:

1. **Create conversations for existing direct message pairs**
2. **Migrate existing messages to reference conversations**
3. **Set up conversation participants**

### 3. Update Application Code

The application code has been updated to work with the new schema:

- **Models**: Updated User and Message models, added new Conversation, ConversationParticipant, and MessageStatus models
- **Services**: Updated MessagesService to work with conversations
- **Controllers**: Updated MessagesController with new endpoints
- **DTOs**: Updated CreateMessageDto and UpdateMessageDto

## New Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255),
    image VARCHAR(255),
    online BOOLEAN DEFAULT FALSE,
    last_seen TIMESTAMP,
    phone VARCHAR(255),
    about VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Conversations Table
```sql
CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    is_group BOOLEAN DEFAULT FALSE,
    created_by INT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Conversation Participants Table
```sql
CREATE TABLE conversation_participants (
    id SERIAL PRIMARY KEY,
    conversation_id INT REFERENCES conversations(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(conversation_id, user_id)
);
```

### Messages Table (Updated)
```sql
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    conversation_id INT REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id INT REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    attachment_url VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Message Status Table
```sql
CREATE TABLE message_status (
    id SERIAL PRIMARY KEY,
    message_id INT REFERENCES messages(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'sent',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(message_id, user_id)
);
```

## API Endpoints

### Messages

- `POST /messages` - Create a new message
- `GET /messages` - Get all messages
- `GET /messages/:id` - Get a specific message
- `GET /messages/user/:userId` - Get all messages for a user
- `GET /messages/conversation/:conversationId` - Get all messages in a conversation
- `PUT /messages/:id` - Update a message
- `DELETE /messages/:id` - Delete a message

## Seeding Data

The seed script has been updated to work with the new schema. Run it with:

```bash
npm run seed
```

This will create sample users, conversations, and messages that demonstrate both direct messaging and group chat functionality.