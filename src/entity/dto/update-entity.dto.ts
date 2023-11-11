import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateEntityDto {
    @IsString()
    @IsNotEmpty()
    title: string;
}
