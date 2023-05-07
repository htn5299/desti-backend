import { IsNotEmpty, MaxLength, MinLength, IsEmail } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  password: string
}
