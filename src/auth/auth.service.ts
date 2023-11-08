import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async validateUser({ email, password }: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
  }
}
