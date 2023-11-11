import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { DataType } from '@prisma/client';

export class CreateEntityAttributeDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsIn(Object.values(DataType))
    type: DataType;
}
