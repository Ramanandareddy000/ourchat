import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
  Unique,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Message } from './message.model';

@Table({
  tableName: 'message_status',
  timestamps: true,
})
export class MessageStatus extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => Message)
  @Unique('message_user_unique')
  @Column(DataType.INTEGER)
  declare message_id: number;

  @ForeignKey(() => User)
  @Unique('message_user_unique')
  @Column(DataType.INTEGER)
  declare user_id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare status: string;

  @BelongsTo(() => Message)
  declare message: Message;

  @BelongsTo(() => User)
  declare user: User;

  @UpdatedAt
  @Column(DataType.DATE)
  declare updated_at: Date;
}
