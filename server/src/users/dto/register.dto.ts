import { Transform, TransformFnParams } from 'class-transformer';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => (value as string)?.trim())
  username: string;

  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @Transform(({ value }: TransformFnParams) => (value as string)?.trim())
  password: string;
}
