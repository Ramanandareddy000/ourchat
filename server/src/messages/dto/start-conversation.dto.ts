import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';

export class StartConversationDto {
  @IsInt({ message: 'Current user ID must be a valid integer' })
  @Min(1, { message: 'Current user ID must be greater than 0' })
  current_user_id!: number;

  @IsOptional()
  @IsInt({ message: 'Target user ID must be a valid integer' })
  @Min(1, { message: 'Target user ID must be greater than 0' })
  target_user_id?: number;

  @IsOptional()
  @IsString({ message: 'Target username must be a string' })
  @IsNotEmpty({ message: 'Target username cannot be empty' })
  target_username?: string;

  @ValidateIf(
    (o: { target_user_id?: number; target_username?: string }) =>
      !o.target_user_id && !o.target_username,
  )
  @IsNotEmpty({ message: 'Either target_user_id or target_username must be provided' })
  private _atLeastOneField?: never;
}