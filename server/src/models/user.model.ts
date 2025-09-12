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
  ForeignKey,
} from 'sequelize-typescript';

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
  username: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  password_hash: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  display_name: string;

  @Column(DataType.STRING)
  avatar_url: string;

  @CreatedAt
  @Column(DataType.DATE)
  declare created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare updated_at: Date;
}
