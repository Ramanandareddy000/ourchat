postgres@ramananda-UX430UAR:~$ psql
psql (17.6 (Ubuntu 17.6-1.pgdg22.04+1))
Type "help" for help.

postgres=# \c pingme
You are now connected to database "pingme" as user "postgres".
pingme=# select *from users;
pingme=# \d users
                                        Table "public.users"
    Column     |           Type           | Collation | Nullable |              Default              
---------------+--------------------------+-----------+----------+-----------------------------------
 id            | integer                  |           | not null | nextval('users_id_seq'::regclass)
 username      | character varying(255)   |           | not null | 
 password_hash | character varying(255)   |           | not null | 
 display_name  | character varying(255)   |           | not null | 
 avatar_url    | character varying(255)   |           |          | 
 image         | character varying(255)   |           |          | 
 online        | boolean                  |           |          | 
 last_seen     | character varying(255)   |           |          | 
 phone         | character varying(255)   |           |          | 
 about         | character varying(255)   |           |          | 
 created_at    | timestamp with time zone |           |          | 
 updated_at    | timestamp with time zone |           |          | 
Indexes:
    "users_pkey" PRIMARY KEY, btree (id)
    "users_username_key" UNIQUE CONSTRAINT, btree (username)
Referenced by:
    TABLE "conversation_participants" CONSTRAINT "conversation_participants_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
    TABLE "conversations" CONSTRAINT "conversations_created_by_fkey" FOREIGN KEY (created_by) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
    TABLE "message_status" CONSTRAINT "message_status_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
    TABLE "messages" CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY (sender_id) REFERENCES users(id) ON UPDATE CASCADE

pingme=# \l
                                                List of databases
   Name    |  Owner   | Encoding | Locale Provider | Collate | Ctype | Locale | ICU Rules |   Access privileges   
-----------+----------+----------+-----------------+---------+-------+--------+-----------+-----------------------
 pingme    | postgres | UTF8     | libc            | en_IN   | en_IN |        |           | 
 postgres  | postgres | UTF8     | libc            | en_IN   | en_IN |        |           | 
 template0 | postgres | UTF8     | libc            | en_IN   | en_IN |        |           | =c/postgres          +
           |          |          |                 |         |       |        |           | postgres=CTc/postgres
 template1 | postgres | UTF8     | libc            | en_IN   | en_IN |        |           | =c/postgres          +
           |          |          |                 |         |       |        |           | postgres=CTc/postgres
(4 rows)

pingme=# \dt
                   List of relations
 Schema |           Name            | Type  |  Owner   
--------+---------------------------+-------+----------
 public | conversation_participants | table | postgres
 public | conversations             | table | postgres
 public | message_status            | table | postgres
 public | messages                  | table | postgres
 public | users                     | table | postgres
(5 rows)

pingme=# \d conversations
                                       Table "public.conversations"
   Column   |           Type           | Collation | Nullable |                  Default                  
------------+--------------------------+-----------+----------+-------------------------------------------
 id         | integer                  |           | not null | nextval('conversations_id_seq'::regclass)
 name       | character varying(255)   |           |          | 
 is_group   | boolean                  |           | not null | 
 created_by | integer                  |           |          | 
 created_at | timestamp with time zone |           |          | 
 updated_at | timestamp with time zone |           |          | 
Indexes:
    "conversations_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:
    "conversations_created_by_fkey" FOREIGN KEY (created_by) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
Referenced by:
    TABLE "conversation_participants" CONSTRAINT "conversation_participants_conversation_id_fkey" FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON UPDATE CASCADE ON DELETE CASCADE
    TABLE "messages" CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON UPDATE CASCADE

pingme=# conversation_participants
pingme-# 
pingme-# \l
                                                List of databases
   Name    |  Owner   | Encoding | Locale Provider | Collate | Ctype | Locale | ICU Rules |   Access privileges   
-----------+----------+----------+-----------------+---------+-------+--------+-----------+-----------------------
 pingme    | postgres | UTF8     | libc            | en_IN   | en_IN |        |           | 
 postgres  | postgres | UTF8     | libc            | en_IN   | en_IN |        |           | 
 template0 | postgres | UTF8     | libc            | en_IN   | en_IN |        |           | =c/postgres          +
           |          |          |                 |         |       |        |           | postgres=CTc/postgres
 template1 | postgres | UTF8     | libc            | en_IN   | en_IN |        |           | =c/postgres          +
           |          |          |                 |         |       |        |           | postgres=CTc/postgres
(4 rows)

pingme-# \dt
                   List of relations
 Schema |           Name            | Type  |  Owner   
--------+---------------------------+-------+----------
 public | conversation_participants | table | postgres
 public | conversations             | table | postgres
 public | message_status            | table | postgres
 public | messages                  | table | postgres
 public | users                     | table | postgres
(5 rows)

pingme-# \d users
                                        Table "public.users"
    Column     |           Type           | Collation | Nullable |              Default              
---------------+--------------------------+-----------+----------+-----------------------------------
 id            | integer                  |           | not null | nextval('users_id_seq'::regclass)
 username      | character varying(255)   |           | not null | 
 password_hash | character varying(255)   |           | not null | 
 display_name  | character varying(255)   |           | not null | 
 avatar_url    | character varying(255)   |           |          | 
 image         | character varying(255)   |           |          | 
 online        | boolean                  |           |          | 
 last_seen     | character varying(255)   |           |          | 
 phone         | character varying(255)   |           |          | 
 about         | character varying(255)   |           |          | 
 created_at    | timestamp with time zone |           |          | 
 updated_at    | timestamp with time zone |           |          | 
Indexes:
    "users_pkey" PRIMARY KEY, btree (id)
    "users_username_key" UNIQUE CONSTRAINT, btree (username)
Referenced by:
    TABLE "conversation_participants" CONSTRAINT "conversation_participants_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
    TABLE "conversations" CONSTRAINT "conversations_created_by_fkey" FOREIGN KEY (created_by) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
    TABLE "message_status" CONSTRAINT "message_status_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
    TABLE "messages" CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY (sender_id) REFERENCES users(id) ON UPDATE CASCADE

pingme-# \d messages
                                         Table "public.messages"
     Column      |           Type           | Collation | Nullable |               Default                
-----------------+--------------------------+-----------+----------+--------------------------------------
 id              | integer                  |           | not null | nextval('messages_id_seq'::regclass)
 conversation_id | integer                  |           |          | 
 sender_id       | integer                  |           |          | 
 text            | text                     |           | not null | 
 attachment_url  | character varying(255)   |           |          | 
 created_at      | timestamp with time zone |           |          | 
 updated_at      | timestamp with time zone |           |          | 
Indexes:
    "messages_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:
    "messages_conversation_id_fkey" FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON UPDATE CASCADE
    "messages_sender_id_fkey" FOREIGN KEY (sender_id) REFERENCES users(id) ON UPDATE CASCADE
Referenced by:
    TABLE "message_status" CONSTRAINT "message_status_message_id_fkey" FOREIGN KEY (message_id) REFERENCES messages(id) ON UPDATE CASCADE ON DELETE CASCADE

pingme-# \d message_status
                                       Table "public.message_status"
   Column   |           Type           | Collation | Nullable |                  Default                   
------------+--------------------------+-----------+----------+--------------------------------------------
 id         | integer                  |           | not null | nextval('message_status_id_seq'::regclass)
 message_id | integer                  |           |          | 
 user_id    | integer                  |           |          | 
 status     | character varying(255)   |           | not null | 
 updated_at | timestamp with time zone |           |          | 
 createdAt  | timestamp with time zone |           | not null | 
Indexes:
    "message_status_pkey" PRIMARY KEY, btree (id)
    "message_status_message_id_user_id_key" UNIQUE CONSTRAINT, btree (message_id, user_id)
Foreign-key constraints:
    "message_status_message_id_fkey" FOREIGN KEY (message_id) REFERENCES messages(id) ON UPDATE CASCADE ON DELETE CASCADE
    "message_status_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE

pingme-# \d conversations
                                       Table "public.conversations"
   Column   |           Type           | Collation | Nullable |                  Default                  
------------+--------------------------+-----------+----------+-------------------------------------------
 id         | integer                  |           | not null | nextval('conversations_id_seq'::regclass)
 name       | character varying(255)   |           |          | 
 is_group   | boolean                  |           | not null | 
 created_by | integer                  |           |          | 
 created_at | timestamp with time zone |           |          | 
 updated_at | timestamp with time zone |           |          | 
Indexes:
    "conversations_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:
    "conversations_created_by_fkey" FOREIGN KEY (created_by) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
Referenced by:
    TABLE "conversation_participants" CONSTRAINT "conversation_participants_conversation_id_fkey" FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON UPDATE CASCADE ON DELETE CASCADE
    TABLE "messages" CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON UPDATE CASCADE

pingme-# \d conversation_partcipants
Did not find any relation named "conversation_partcipants".
pingme-# \d conversation_participants
                                         Table "public.conversation_participants"
     Column      |           Type           | Collation | Nullable |                        Default                        
-----------------+--------------------------+-----------+----------+-------------------------------------------------------
 id              | integer                  |           | not null | nextval('conversation_participants_id_seq'::regclass)
 conversation_id | integer                  |           |          | 
 user_id         | integer                  |           |          | 
 role            | character varying(255)   |           | not null | 
 joined_at       | timestamp with time zone |           |          | 
 updated_at      | timestamp with time zone |           |          | 
Indexes:
    "conversation_participants_pkey" PRIMARY KEY, btree (id)
    "conversation_participants_conversation_id_user_id_key" UNIQUE CONSTRAINT, btree (conversation_id, user_id)
Foreign-key constraints:
    "conversation_participants_conversation_id_fkey" FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON UPDATE CASCADE ON DELETE CASCADE
    "conversation_participants_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE

pingme-# 

