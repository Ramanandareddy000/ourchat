# Message API Endpoints Documentation

## Overview
This document describes the purpose of each message API endpoint and where the data would be rendered in a typical chat application frontend.

## Endpoints

### 1. Create Message
**Endpoint**: `POST /messages`
**Purpose**: Creates a new message in a conversation
**Frontend Usage**: 
- Triggered when a user sends a new message in the chat interface
- Renders in the message list of the active conversation
- Updates the conversation preview in the sidebar with the latest message

### 2. Get All Messages
**Endpoint**: `GET /messages`
**Purpose**: Retrieves all messages in the system (admin functionality)
**Frontend Usage**: 
- Admin dashboard for viewing all messages across the platform
- Not typically used in regular user interfaces

### 3. Get Message by ID
**Endpoint**: `GET /messages/:id`
**Purpose**: Retrieves a specific message by its unique identifier
**Frontend Usage**: 
- Loading a specific message when navigating directly to it
- Message detail view in admin panel
- Message search results

### 4. Get Messages by User ID
**Endpoint**: `GET /messages/user/:userId`
**Purpose**: Retrieves all messages sent by or received by a specific user
**Frontend Usage**: 
- User's message history page
- Profile page showing user's activity
- Exporting user's conversation history

### 5. Get Conversations for User
**Endpoint**: `GET /messages/user/:userId/conversations`
**Purpose**: Retrieves all conversations that a user is participating in
**Frontend Usage**: 
- Main chat interface - conversation list in the sidebar
- Shows group chats and direct messages
- Displays conversation names, participants, and last message previews

### 6. Get Messages by Conversation ID
**Endpoint**: `GET /messages/conversation/:conversationId`
**Purpose**: Retrieves all messages within a specific conversation
**Frontend Usage**: 
- Main chat window - displays the message history for the active conversation
- Loading previous messages when scrolling up
- Search within a specific conversation

### 7. Update Message
**Endpoint**: `PUT /messages/:id`
**Purpose**: Updates an existing message (editing functionality)
**Frontend Usage**: 
- When a user edits their message
- Updates the message content in real-time for all participants
- Shows edited status/timestamp

### 8. Delete Message
**Endpoint**: `DELETE /messages/:id`
**Purpose**: Deletes a message from the system
**Frontend Usage**: 
- When a user deletes their message
- Removes the message from the conversation view for all participants
- May show a "message deleted" placeholder or remove entirely

## Frontend Component Mapping

### Sidebar/Conversation List
- Uses endpoint #5 (Get Conversations for User)
- Displays list of conversations with names, participants, and last message previews

### Main Chat Window
- Uses endpoint #6 (Get Messages by Conversation ID)
- Displays the message history for the active conversation
- Live updates as new messages arrive

### Message Input Area
- Uses endpoint #1 (Create Message)
- Sends new messages to the active conversation
- Triggers real-time updates in the conversation

### Message Actions (Edit/Delete)
- Uses endpoints #7 (Update Message) and #8 (Delete Message)
- Allows users to modify their sent messages
- Updates the UI in real-time for all participants

### User Profile/History
- Uses endpoints #3 (Get Message by ID) and #4 (Get Messages by User ID)
- Shows a user's message history
- Displays activity and participation in conversations