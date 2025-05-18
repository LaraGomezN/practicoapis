import { Controller, Get, UseInterceptors, Post, Param, Body, Put, Delete, HttpCode } from '@nestjs/common';
import { RestauranteService } from './restaurante.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RestauranteDto } from './restaurante.dto';
import { RestauranteEntity } from './restaurante.entity';
import { plainToInstance } from 'class-transformer';

@Controller('restaurantes')
@UseInterceptors(BusinessErrorsInterceptor)
export class RestauranteController {
    constructor(private readonly restauranteService: RestauranteService) {}

    @Get()
    async findAll() {
        return await this.restauranteService.findAll();
    }

    @Get(':restauranteId')
    async findOne(@Param('restauranteId') restauranteId: string) {
        return await this.restauranteService.findOne(restauranteId);
    }

    @Post()
    async create(@Body() restauranteDto: RestauranteDto) {
        const restaurante: RestauranteEntity = plainToInstance(RestauranteEntity, restauranteDto);
        return await this.restauranteService.create(restaurante);
    }

    @Put(':restauranteId')
    async update(@Param('restauranteId') restauranteId: string, @Body() restauranteDto: RestauranteDto) {
        const restaurante: RestauranteEntity = plainToInstance(RestauranteEntity, restauranteDto);
        return await this.restauranteService.update(restauranteId, restaurante);
    }

    @Delete(':restauranteId')
    @HttpCode(204)
    async delete(@Param('restauranteId') restauranteId: string) {
        return await this.restauranteService.delete(restauranteId);
    }


}
