import { Injectable } from '@nestjs/common';
import { Schema } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SchemaService {
    constructor(private readonly prisma: PrismaService) {}

    async createSchema(userId: number, title: string): Promise<Schema> {
        return this.prisma.schema.create({
            data: {
                title,
                user: { connect: { id: userId } },
            },
        });
    }

    async getAllSchemas(userId: number) {
        return this.prisma.schema.findMany({
            where: { userId },
        });
    }
}
