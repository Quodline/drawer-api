import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSchemaDto {
    @IsString()
    @IsNotEmpty()
    title: string;
}
