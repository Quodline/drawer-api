import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService,
    ) {}

    async signup(dto: AuthDto) {
        try {
            const user = await this.createUser(dto);

            return this.signToken(user.id, user.email);
        } catch (error) {
            this.throwCredentialsTaken(error);
        }
    }

    async signin({ email, password }: AuthDto) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (user && (await argon.verify(user.password, password))) {
            return this.signToken(user.id, user.email);
        }

        throw new ForbiddenException('Credentials incorrect');
    }

    private async createUser({ email, password }: AuthDto): Promise<User> {
        const hashed = await argon.hash(password);

        return this.prisma.user.create({
            data: { email, password: hashed },
        });
    }

    private async signToken(userId: number, email: string): Promise<string> {
        const payload = { email, sub: userId };
        const options = {
            expiresIn: '60m',
            secret: this.config.get('JWT_SECRET'),
        };

        return this.jwt.signAsync(payload, options);
    }

    private throwCredentialsTaken(e: Error) {
        if (
            e instanceof Prisma.PrismaClientKnownRequestError &&
            e.code === 'P2002'
        ) {
            throw new ForbiddenException('Credentials taken');
        }

        throw e;
    }
}
