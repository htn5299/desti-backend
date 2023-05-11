import { Controller, Get, Query, Inject, UseGuards, HttpStatus } from '@nestjs/common'
import { Routes, Services } from '../../utils/constranst'
import { IUserService } from '../interfaces/user'
import { JwtAuthGuard } from '../../auth/guard/jwt.guard'
import { MyHttpException } from '../../utils/myHttpException'
import { User } from '../utils/user.decorator'
@Controller(Routes.USERS)
export class UsersController {
  constructor(@Inject(Services.USERS) private readonly userService: IUserService) {}
  @UseGuards(JwtAuthGuard)
  @Get('search')
  searchUsers(@Query('q') query: string) {
    if (!query) {
      throw new MyHttpException('Invalid Query', HttpStatus.NOT_FOUND)
    }
    return this.userService.search(query)
  }
  @Get('check')
  async findUser(@Query('email') email: string) {
    if (!email) {
      throw new MyHttpException('Invalid Query', HttpStatus.NOT_FOUND)
    }
    const user = await this.userService.find({ email })
    return user
  }
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@User('sub') id: number) {
    return this.userService.getById(id)
  }
}
