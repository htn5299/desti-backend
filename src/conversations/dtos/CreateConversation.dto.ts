import { IsNotEmpty, IsString } from 'class-validator'

export class CreateConversationDto {
  @IsNotEmpty()
  email: string

  @IsNotEmpty()
  @IsString()
  message: string
}
