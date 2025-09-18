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
  HasMany,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Conversation } from './conversation.model';
import { MessageStatus } from './message-status.model';

@Table({
  tableName: 'messages',
  timestamps: true,
})
export class Message extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => Conversation)
  @Column(DataType.INTEGER)
  declare conversation_id: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare sender_id: number;

  @AllowNull(false)
  @Column(DataType.TEXT)
  declare text: string;

  @Column(DataType.STRING)
  declare attachment_url: string | null;

  @BelongsTo(() => Conversation)
  declare conversation: Conversation;

  @BelongsTo(() => User)
  declare sender: User;

  @HasMany(() => MessageStatus)
  declare messageStatuses: MessageStatus[];

  @CreatedAt
  @Column(DataType.DATE)
  declare created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare updated_at: Date;
}
