import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { SchemaService } from './schema.service';
import { CreateSchemaDto, UpdateSchemaDto } from './dto';

@UseGuards(JwtGuard)
@Controller('schemas')
export class SchemaController {
    constructor(private readonly schemaService: SchemaService) {}

    @Get()
    async getUserSchemas(@GetUser() user: User) {
        return this.schemaService.getAllSchemas(user.id);
    }

    @Post()
    async createSchema(@GetUser() user: User, @Body() body: CreateSchemaDto) {
        return this.schemaService.createSchema(user.id, body);
    }

    @Patch(':id')
    async editSchema(@Param('id') id: string, @Body() body: UpdateSchemaDto) {
        return this.schemaService.updateSchema(+id, body);
    }

    @Delete(':id')
    async deleteSchema(@Param('id') id: string) {
        return this.schemaService.deleteSchema(+id);
    }
}
