export interface CreateUserDto {
  username: string;
  password: string;
  displayName: string;
  avatarUrl?: string;
}
