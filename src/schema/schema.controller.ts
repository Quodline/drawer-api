import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { SchemaService } from './schema.service';
import { CreateSchemaDto } from './dto';

@UseGuards(JwtGuard)
@Controller('schemas')
export class SchemaController {
    constructor(private readonly schemaService: SchemaService) {}

    @Get()
    async getUserSchemas(@GetUser() user: User) {
        return {
            schemas: await this.schemaService.getAllSchemas(user.id),
        };
    }

    @Post()
    async createSchema(
        @GetUser() user: User,
        @Body() { title }: CreateSchemaDto,
    ) {
        return this.schemaService.createSchema(user.id, title);
    }
}
