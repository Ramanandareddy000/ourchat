Here’s a scalable yet manageable database schema for your chatting app.
It builds on your existing users and messages tables, keeping it practical for a single developer to implement during your internship while leaving room for future growth.

Final Schema Design
1. Users Table (existing)

Your users table is solid.
We'll keep everything as is since there's no `is_group` column in this table.

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

2. Conversations Table

For group chats and direct 1-on-1 chats.
Every chat (even private ones) gets a conversation record.

CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255), -- For group chats
    is_group BOOLEAN NOT NULL,
    created_by INT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

3. Conversation Participants Table

Tracks which users belong to which conversations.
Also stores roles (e.g., admin in groups).

CREATE TABLE conversation_participants (
    id SERIAL PRIMARY KEY,
    conversation_id INT REFERENCES conversations(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member', -- admin / member
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(conversation_id, user_id)
);

4. Messages Table (Updated)

Currently, your messages table directly references sender_id and receiver_id, which doesn't scale for group chats.
We'll link messages to conversations instead.

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    conversation_id INT REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id INT REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    attachment_url VARCHAR(255), -- For images, files, etc.
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


Migration Tip:
During migration, you'll need to:
1. Add the conversation_id column to messages table
2. Populate conversation_id based on existing sender_id/receiver_id pairs
3. Eventually remove receiver_id as it's no longer needed in the new schema

5. Message Status Table (Read Receipts)

Tracks delivered, seen, etc., per user.
Not mandatory now, but adding it will impress your manager.

CREATE TABLE message_status (
    id SERIAL PRIMARY KEY,
    message_id INT REFERENCES messages(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'sent', -- sent / delivered / read
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(message_id, user_id)
);

Entity Relationship Diagram (ERD)
users
  │
  │ 1:N
  │
conversation_participants
  │
  │ N:1
  │
conversations
  │
  │ 1:N
  │
messages
  │
  │ 1:N
  │
message_status

Why This Works
Feature	Supported By
Direct messages	conversations.is_group = FALSE
Group messages	conversation_participants
Message delivery	message_status
Read receipts	message_status.status = 'read'
Roles in group chats	conversation_participants.role
Attachments	messages.attachment_url
Sample Flow
Create a group
INSERT INTO conversations (name, is_group, created_by)
VALUES ('Project Team', TRUE, 1);

Add members to group
INSERT INTO conversation_participants (conversation_id, user_id, role)
VALUES (1, 1, 'admin'), (1, 2, 'member'), (1, 3, 'member');

Send a message
INSERT INTO messages (conversation_id, sender_id, text)
VALUES (1, 2, 'Hey team, let\'s get started!');

Mark message as read
INSERT INTO message_status (message_id, user_id, status)
VALUES (1, 3, 'read')
ON CONFLICT (message_id, user_id) 
DO UPDATE SET status = 'read', updated_at = NOW();

Implementation Strategy

Since you're the only developer, here's the safe rollout plan:

Phase 1 – Introduce the new schema alongside the existing one, adding conversation_id to messages table.

Phase 2 – Migrate existing direct messages to the conversation model by creating conversation records for each pair of users.

Phase 3 – Add group chat support using conversations and conversation_participants.

Phase 4 – Add read receipts with message_status.

Phase 5 – Clean up deprecated columns and remove old messaging logic.

Final Notes

This schema strikes a balance:

Simple enough for you to build in your internship timeline.

Scalable for future features like voice messages, reactions, or even channels.

Focus on Phase 1 and Phase 2 during your internship — group chat support will already be a big win.

Your manager will see that you’ve designed for long-term growth, which will definitely impress them.