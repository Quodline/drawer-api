import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { SchemaModule } from './schema/schema.module';
import { EntityModule } from './entity/entity.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        AuthModule,
        PrismaModule,
        SchemaModule,
        EntityModule,
    ],
})
export class AppModule {}
