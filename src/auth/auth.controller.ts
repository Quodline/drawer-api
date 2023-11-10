import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { GetUser } from './decorator';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('whoami')
  profile(@GetUser() user: User) {
    return user;
  }

  @Post('signup')
  async signup(@Body() dto: AuthDto) {
    return {
      access_token: await this.authService.signup(dto),
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Body() dto: AuthDto) {
    return {
      access_token: await this.authService.signin(dto),
    };
  }
}
