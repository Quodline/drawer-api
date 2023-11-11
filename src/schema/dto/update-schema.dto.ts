import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateSchemaDto {
    @IsString()
    @IsNotEmpty()
    title: string;
}
