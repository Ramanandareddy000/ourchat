import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
  Unique,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Conversation } from './conversation.model';

@Table({
  tableName: 'conversation_participants',
  timestamps: true,
})
export class ConversationParticipant extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => Conversation)
  @Unique('conversation_user_unique')
  @Column(DataType.INTEGER)
  declare conversation_id: number;

  @ForeignKey(() => User)
  @Unique('conversation_user_unique')
  @Column(DataType.INTEGER)
  declare user_id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare role: string;

  @BelongsTo(() => Conversation)
  declare conversation: Conversation;

  @BelongsTo(() => User)
  declare user: User;

  @CreatedAt
  @Column(DataType.DATE)
  declare joined_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare updated_at: Date;
}
