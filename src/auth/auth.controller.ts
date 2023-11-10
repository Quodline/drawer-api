import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { GetUser } from './decorator';
import { User } from '@prisma/client';
import { JwtGuard } from './guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtGuard)
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
