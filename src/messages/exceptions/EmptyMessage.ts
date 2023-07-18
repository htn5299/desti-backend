import { HttpException, HttpStatus } from '@nestjs/common'

export class EmptyMessageException extends HttpException {
  constructor() {
    super('Message must contain content', HttpStatus.BAD_REQUEST)
  }
}
