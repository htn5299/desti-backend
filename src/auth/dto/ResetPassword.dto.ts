import { IsNotEmpty, MinLength, MaxLength } from 'class-validator'

export class ResetPasswordDto {
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  password: string
}
