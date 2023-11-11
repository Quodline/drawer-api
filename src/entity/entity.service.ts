import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEntityDto, UpdateEntityDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class EntityService {
    private includedRelations = {
        attributes: true,
        relationships: true,
    };

    constructor(private readonly prisma: PrismaService) {}

    async getEntities(schemaId: number) {
        return this.prisma.entity.findMany({
            where: { schemaId },
            include: this.includedRelations,
        });
    }

    async addEntity(schemaId: number, { title, attributes }: CreateEntityDto) {
        return this.prisma.entity.create({
            data: {
                title,
                schema: { connect: { id: schemaId } },
                attributes: { createMany: { data: attributes || [] } },
            },
            include: this.includedRelations,
        });
    }

    async updateEntity(id: number, body: UpdateEntityDto) {
        try {
            return await this.prisma.entity.update({
                where: { id: id },
                data: body,
                include: this.includedRelations,
            });
        } catch (error) {
            this.throwNotFound(error, id);
        }
    }

    async deleteEntity(id: number) {
        try {
            return await this.prisma.entity.delete({
                where: { id },
                include: this.includedRelations,
            });
        } catch (error) {
            this.throwNotFound(error, id);
        }
    }

    throwNotFound(error: Error, id: number) {
        throw error instanceof Prisma.PrismaClientKnownRequestError
            ? new NotFoundException(`Entity '${id}' not found`)
            : error;
    }
}
