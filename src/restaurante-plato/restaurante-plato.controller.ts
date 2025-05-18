import { Controller, Get, UseInterceptors, Post, Param, Body, Put, Delete, HttpCode } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RestaurantePlatoService } from './restaurante-plato.service';
import { PlatoDto } from 'src/plato/plato.dto';
import { plainToInstance } from 'class-transformer';
import { PlatoEntity } from 'src/plato/plato.entity';


@Controller('restaurants')
@UseInterceptors(BusinessErrorsInterceptor)
export class RestaurantePlatoController {
    constructor(private readonly restaurantePlatoService: RestaurantePlatoService) {}

    @Post(':restauranteId/dishes/:platoId')
    async addDishToRestaurant(@Param('restauranteId') restauranteId: string, @Param('platoId') platoId: string) {
        return await this.restaurantePlatoService.addDishToRestaurant(restauranteId, platoId);
    }

    @Get(':restauranteId/dishes')
    async findDishesFromRestaurant(@Param('restauranteId') restauranteId: string) {
        return await this.restaurantePlatoService.findDishesFromRestaurant(restauranteId);
    }

    @Get(':restauranteId/dishes/:platoId')
    async findDishFromRestaurant(@Param('restauranteId') restauranteId: string, @Param('platoId') platoId: string) {
        return await this.restaurantePlatoService.findDishFromRestaurant(restauranteId, platoId);
    }

    @Put(':restauranteId/dishes')
    async updateDishesFromRestaurant(@Body() platosDto: PlatoDto[], @Param('restauranteId') restauranteId: string) {
        const platos = plainToInstance(PlatoEntity, platosDto);
        return await this.restaurantePlatoService.updateDishesFromRestaurant(restauranteId, platos);
    }

    @Delete(':restauranteId/dishes/:platoId')
    @HttpCode(204)
    async deleteDishFromRestaurant(@Param('restauranteId') restauranteId: string, @Param('platoId') platoId: string) {
        return await this.restaurantePlatoService.deleteDishFromRestaurant(restauranteId, platoId);
    }
}
