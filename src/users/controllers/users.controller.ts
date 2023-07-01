import {
  Controller,
  Get,
  Query,
  Inject,
  UseGuards,
  HttpStatus,
  Param,
  Patch,
  Body,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe
} from '@nestjs/common'
import { Routes, Services } from '../../utils/constranst'
import { IUserService } from '../interfaces/user'
import { JwtAuthGuard } from '../../auth/guard/jwt.guard'
import { MyHttpException } from '../../utils/myHttpException'
import { User } from '../utils/user.decorator'
import { UpdateProfileDto } from '../dto/UpdateProfile.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { UpdateProfileParams } from '../../utils/types'
import { IProfile } from '../interfaces/profile'

@Controller(Routes.USERS)
export class UsersController {
  constructor(
    @Inject(Services.USERS) private readonly userService: IUserService,
    @Inject(Services.PROFILE) private readonly profileService: IProfile
  ) {}

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
    return await this.userService.findOne({ email })
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@User('sub') id: number) {
    return this.userService.getUser({ id })
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateProfile(
    @User('sub') id: number,
    @Body() content: UpdateProfileDto,
    @UploadedFile() file: Express.MulterS3.File
  ) {
    const updateProfileParams: UpdateProfileParams = { id, about: content.about, file }
    return await this.profileService.update(updateProfileParams)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUser({ id })
  }
}
