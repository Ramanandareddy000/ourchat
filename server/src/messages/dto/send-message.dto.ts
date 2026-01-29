import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class SendMessageDto {
  @IsInt({ message: 'Sender ID must be a valid integer' })
  @Min(1, { message: 'Sender ID must be greater than 0' })
  sender_id!: number;

  @IsOptional()
  @IsInt({ message: 'Receiver ID must be a valid integer' })
  @Min(1, { message: 'Receiver ID must be greater than 0' })
  receiver_id?: number;

  @IsOptional()
  @IsInt({ message: 'Conversation ID must be a valid integer' })
  @Min(1, { message: 'Conversation ID must be greater than 0' })
  conversation_id?: number;

  @IsString({ message: 'Message content must be a string' })
  @IsNotEmpty({ message: 'Message content cannot be empty' })
  @MaxLength(10000, {
    message: 'Message content cannot exceed 10,000 characters',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  content!: string;

  @ValidateIf(
    (o: { receiver_id?: number; conversation_id?: number }) =>
      !o.receiver_id && !o.conversation_id,
  )
  @IsNotEmpty({
    message: 'Either receiver_id or conversation_id must be provided',
  })
  private _atLeastOneTarget?: never;
}
