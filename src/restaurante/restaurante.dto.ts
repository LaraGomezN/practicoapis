import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class RestauranteDto {
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly direccion: string;

    @IsString()
    @IsNotEmpty()
    readonly tipoCocina: string;

    @IsUrl()
    @IsNotEmpty()
    readonly paginaWeb: string;
}
