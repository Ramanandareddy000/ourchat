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
import { ConversationParticipant } from './conversation-participant.model';
import { Message } from './message.model';

@Table({
  tableName: 'conversations',
  timestamps: true,
})
export class Conversation extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column(DataType.STRING)
  declare name: string | null;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  declare is_group: boolean;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare created_by: number | null;

  @BelongsTo(() => User)
  declare creator: User;

  @HasMany(() => ConversationParticipant)
  declare participants: ConversationParticipant[];

  @HasMany(() => Message)
  declare messages: Message[];

  @CreatedAt
  @Column(DataType.DATE)
  declare created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare updated_at: Date;
}
