import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateEntityAttributeDto } from './create-entity-attribute.dto';

export class CreateEntityDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @IsArray()
    attributes?: Array<CreateEntityAttributeDto>;
}
