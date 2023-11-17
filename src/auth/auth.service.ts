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
            const token = await this.signToken(user.id, user.email);

            return { token };
        } catch (error) {
            this.throwCredentialsTaken(error);
        }
    }

    async signin({ email, password }: AuthDto) {
        const result = await this.prisma.user.findUnique({ where: { email } });

        if (result) {
            const { password: passwordHash, ...user } = result;

            if (await argon.verify(passwordHash, password)) {
                const token = await this.signToken(user.id, user.email);

                return { ...user, token };
            }
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

    private throwCredentialsTaken(error: Error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002'
        ) {
            throw new ForbiddenException('Credentials taken');
        }

        throw error;
    }
}
