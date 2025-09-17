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
} from 'sequelize-typescript';
import { User } from './user.model';

@Table({
  tableName: 'messages',
  timestamps: true,
})
export class Message extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @AllowNull(false)
  @Column(DataType.TEXT)
  text: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  time: string;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  is_me: boolean;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  sender_id: number;

  @BelongsTo(() => User)
  sender: User;

  @Column(DataType.STRING)
  sender_name: string;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  receiver_id: number;

  @Column(DataType.BOOLEAN)
  is_group: boolean;

  @CreatedAt
  @Column(DataType.DATE)
  declare created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare updated_at: Date;
}
