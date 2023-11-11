import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Schema } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSchemaDto, UpdateSchemaDto } from './dto';

@Injectable()
export class SchemaService {
    constructor(private readonly prisma: PrismaService) {}

    async createSchema(userId: number, body: CreateSchemaDto): Promise<Schema> {
        return this.prisma.schema.create({
            data: {
                ...body,
                user: { connect: { id: userId } },
            },
        });
    }

    async getAllSchemas(userId: number) {
        return this.prisma.schema.findMany({
            where: { userId },
        });
    }

    async updateSchema(id: number, body: UpdateSchemaDto) {
        try {
            return await this.prisma.schema.update({
                where: { id },
                data: body,
            });
        } catch (error) {
            this.throwNotFound(error, id);
        }
    }

    async deleteSchema(id: number) {
        try {
            return await this.prisma.schema.delete({
                where: { id },
            });
        } catch (error) {
            this.throwNotFound(error, id);
        }
    }

    throwNotFound(error: Error, id: number) {
        throw error instanceof Prisma.PrismaClientKnownRequestError
            ? new NotFoundException(`Schema '${id}' not found`)
            : error;
    }
}
