import { Controller, Get, Query, Inject, UseGuards, HttpStatus } from '@nestjs/common'
import { Routes, Services } from '../../utils/constranst'
import { IUserService } from '../interfaces/user'
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard'
import { MyHttpException } from '../../utils/myHttpException'
@Controller(Routes.USERS)
export class UsersController {
  constructor(@Inject(Services.USERS) private readonly userService: IUserService) {}
  @UseGuards(JwtAuthGuard)
  @Get('search')
  searchUsers(@Query('q') query: string) {
    if (!query) {
      throw new MyHttpException('Invalid Query', HttpStatus.NOT_FOUND)
    }
    return this.userService.searchUsers(query)
  }
  @Get('check')
  async findUser(@Query('email') email: string) {
    if (!email) {
      throw new MyHttpException('Invalid Query', HttpStatus.NOT_FOUND)
    }
    const user = await this.userService.findUser({ email })
    return user
  }
}
