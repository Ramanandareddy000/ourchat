import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Unique,
  CreatedAt,
  UpdatedAt,
  HasMany,
} from 'sequelize-typescript';
import { Conversation } from './conversation.model';
import { ConversationParticipant } from './conversation-participant.model';
import { MessageStatus } from './message-status.model';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  declare username: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare password_hash: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare display_name: string;

  @Column(DataType.STRING)
  declare avatar_url: string | null;

  @Column(DataType.STRING)
  declare image: string | null;

  @Column(DataType.BOOLEAN)
  declare online: boolean;

  @Column(DataType.STRING)
  declare last_seen: string | null;

  @Column(DataType.STRING)
  declare phone: string | null;

  @Column(DataType.STRING)
  declare about: string | null;

  @HasMany(() => Conversation)
  declare createdConversations: Conversation[];

  @HasMany(() => ConversationParticipant)
  declare conversationParticipants: ConversationParticipant[];

  @HasMany(() => MessageStatus)
  declare messageStatuses: MessageStatus[];

  @CreatedAt
  @Column(DataType.DATE)
  declare created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare updated_at: Date;

  // Serialization configuration to control which fields are returned
  toJSON() {
    // Type the attributes properly
    const attributes = { ...this.get() } as {
      [key: string]: any;
      id?: number;
      username?: string;
      display_name?: string;
      avatar_url?: string;
      image?: string;
      online?: boolean;
      last_seen?: string;
      phone?: string;
      about?: string;
      created_at?: Date;
      updated_at?: Date;
      password_hash?: string;
    };

    // Create a new object with frontend-friendly field names
    const frontendAttributes: {
      id?: number;
      username?: string;
      displayName?: string;
      avatarUrl?: string;
      online?: boolean;
      last_seen?: string;
      phone?: string;
      about?: string;
      created_at?: Date;
      updated_at?: Date;
    } = {
      id: attributes.id,
      username: attributes.username,
      displayName: attributes.display_name,
      avatarUrl: attributes.avatar_url || attributes.image,
      online: attributes.online,
      last_seen: attributes.last_seen,
      phone: attributes.phone,
      about: attributes.about,
      created_at: attributes.created_at,
      updated_at: attributes.updated_at,
    };

    // Remove undefined values
    Object.keys(frontendAttributes).forEach((key) => {
      if (frontendAttributes[key] === undefined) {
        delete frontendAttributes[key as keyof typeof frontendAttributes];
      }
    });

    return frontendAttributes;
  }
}
