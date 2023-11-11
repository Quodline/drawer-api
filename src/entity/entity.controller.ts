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
import { EntityService } from './entity.service';
import { JwtGuard } from '../auth/guard';
import { CreateEntityDto, UpdateEntityDto } from './dto';

@UseGuards(JwtGuard)
@Controller('schemas/:schemaId/entities')
export class EntityController {
    constructor(private readonly entityService: EntityService) {}

    @Get()
    async getSchemaEntities(@Param('schemaId') schemaId: string) {
        return this.entityService.getEntities(+schemaId);
    }

    @Post()
    async addEntity(
        @Param('schemaId') schemaId: string,
        @Body() body: CreateEntityDto,
    ) {
        return this.entityService.addEntity(+schemaId, body);
    }

    @Patch(':id')
    async updateEntity(@Param('id') id: string, @Body() body: UpdateEntityDto) {
        return this.entityService.updateEntity(+id, body);
    }

    @Delete(':id')
    async deleteEntity(@Param('id') id: string) {
        return this.entityService.deleteEntity(+id);
    }
}
