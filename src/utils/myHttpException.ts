import { HttpException, HttpStatus } from '@nestjs/common'

export class MyHttpException extends HttpException {
  constructor(message: string, status: HttpStatus, error?: string) {
    super({ message, error }, status)
  }
}
