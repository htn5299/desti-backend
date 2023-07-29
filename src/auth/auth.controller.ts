import { Body, Controller, Get, Inject, Param, Patch, Post, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { Routes, Services } from '../utils/constranst'
import { IUserService } from '../users/interfaces/user'
import { CreateUserDto } from './dto/CreateUser.dto'
import { instanceToPlain } from 'class-transformer'
import { IAuthService } from './interfaces/auth'
import { JwtAuthGuard } from './guard/jwt.guard'
import { Payload } from '../utils/types'
import { User } from '../users/utils/user.decorator'
import { RefreshTokenDto } from './dto/RefreshToken.dto'
import { SignInDto } from './dto/signin.dto'
import { GoogleGuard } from './guard/google.guard'
import { ICodeReset } from '../code-reset/code-reset'
import { ForgetPasswordDto } from './dto/ForgetPassword.dto'
import { ResetPasswordDto } from './dto/ResetPassword.dto'
import { hashPassword } from '../utils/helpers'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    @Inject(Services.USERS) private userService: IUserService,
    @Inject(Services.AUTH) private authService: IAuthService,
    private readonly eventEmitter: EventEmitter2,
    @Inject(Services.CODE_RESET) private codeResetService: ICodeReset
  ) {}

  @Get('google/login')
  @UseGuards(GoogleGuard)
  handleGoogleLogin() {
    return { msg: 'google authentication' }
  }

  // @Get('google/redirect')
  // @UseGuards(GoogleGuard)
  // handleGoogleRedirect(@Req() req) {
  //   return { msg: 'google redirect' }
  // }

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

  @Post('forget')
  async forgetPassword(@Body() body: ForgetPasswordDto) {
    return this.codeResetService.generateCode(body.email)
  }

  @Patch('reset/:id')
  async resetPassword(@Param('id') id: string, @Body() body: ResetPasswordDto) {
    const codeReset = await this.codeResetService.validateCode(id)
    const user = await this.userService.findOne({ email: codeReset.email })
    const password = await hashPassword(body.password)
    await this.userService.save({ ...user, password })
    await this.codeResetService.deleteCode(id)
    return user
  }

  @Get('validateCode/:id')
  async validateCode(@Param('id') id: string) {
    return await this.codeResetService.validateCode(id)
  }
}
