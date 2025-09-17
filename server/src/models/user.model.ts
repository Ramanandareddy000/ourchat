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

  @Column(DataType.BOOLEAN)
  declare is_group: boolean;

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
      is_group?: boolean;
      created_at?: Date;
      updated_at?: Date;
      displayName?: string;
      avatarUrl?: string;
      password_hash?: string;
    };

    // Map model fields to match frontend expectations
    if (attributes.display_name !== undefined) {
      attributes.displayName = attributes.display_name;
    }

    if (attributes.avatar_url !== undefined || attributes.image !== undefined) {
      attributes.avatarUrl = attributes.avatar_url || attributes.image;
    }

    // Remove sensitive fields
    delete attributes.password_hash;
    return attributes;
  }
}
