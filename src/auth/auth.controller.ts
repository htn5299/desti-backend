import { Body, Controller, Inject, Post, Get, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { Routes, Services } from '../utils/constranst'
import { IUserService } from '../users/interfaces/user'
import { CreateUserDto } from './dto/CreateUser.dto'
import { instanceToPlain } from 'class-transformer'
import { IAuthService } from './interfaces/auth'
import { SignInDto } from './dto/SignIn.dto'
import { JwtAuthGuard } from './guard/jwt.guard'
import { Payload } from '../utils/types'
import { User } from '../users/utils/user.decorator'
import { RefreshTokenDto } from './dto/RefreshToken.dto'
@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    @Inject(Services.USERS) private userService: IUserService,
    @Inject(Services.AUTH) private authService: IAuthService
  ) {}

  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return instanceToPlain(await this.userService.create(createUserDto))
  }

  @Post('signin')
  signin(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto)
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  async signout(@Body() body: RefreshTokenDto) {
    return await this.authService.signOut(body.refreshToken)
  }

  @UseGuards(JwtAuthGuard)
  @Get('status')
  async status(@Res() res: Response, @User() user: Payload) {
    res.send(user)
  }

  @Post('refresh-token')
  async refreshToken(@Body() body: RefreshTokenDto) {
    return this.authService.refreshToken(body.refreshToken)
  }
}
