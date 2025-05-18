import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class PlatoDto {
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly descripcion: string;

    @IsNumber()
    @IsNotEmpty()
    readonly precio: number;

    @IsString()
    @IsNotEmpty()
    readonly categoria: string;
}
