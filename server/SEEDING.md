# PingMe Database Seeding

This document explains how to seed the database with sample data for testing the PingMe application.

## Seeding Data for Raju

To populate the database with sample conversations and messages for the user 'raju', run the following command:

```bash
npx ts-node src/seed-raju.ts
```

This script will:

1. Find the existing user 'raju' in the database
2. Create 3 individual chat conversations with:
   - Suresh
   - Priya
   - Ananya
3. Create 2 group chat conversations:
   - "Family Group" with raju, Suresh, and Priya
   - "Office Team" with raju, Ananya, Rahul, and Neha
4. Add 5-10 realistic messages to each conversation

## Verifying the Data

To verify that the data has been correctly inserted into the database, you can run:

```bash
node check-db-enhanced.js
```

This will show information about the users, conversations, participants, and messages in the database.

## Database Schema

The data is structured according to the following schema:

- `users`: Contains user information
- `conversations`: Represents both individual and group chats
- `conversation_participants`: Maps users to conversations with their roles
- `messages`: Contains all messages linked to conversations and senders

All data relationships are properly maintained to ensure the frontend can fetch conversations and messages dynamically.