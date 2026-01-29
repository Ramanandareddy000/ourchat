import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';

export class AddParticipantDto {
  @IsInt({ message: 'Chat ID must be a valid integer' })
  @Min(1, { message: 'Chat ID must be greater than 0' })
  chat_id!: number;

  @IsOptional()
  @IsInt({ message: 'User ID must be a valid integer' })
  @Min(1, { message: 'User ID must be greater than 0' })
  user_id?: number;

  @IsOptional()
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username cannot be empty' })
  username?: string;

  @ValidateIf(
    (o: { user_id?: number; username?: string }) => !o.user_id && !o.username,
  )
  @IsNotEmpty({ message: 'Either user_id or username must be provided' })
  private _atLeastOneField?: never;
}
