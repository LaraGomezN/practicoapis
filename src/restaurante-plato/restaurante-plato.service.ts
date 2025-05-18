import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlatoEntity } from '../plato/plato.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';
import { RestauranteEntity } from '../restaurante/restaurante.entity';

@Injectable()
export class RestaurantePlatoService {
    constructor(
        @InjectRepository(RestauranteEntity)
        private readonly restauranteRepository: Repository<RestauranteEntity>,

        @InjectRepository(PlatoEntity)
        private readonly platoRepository: Repository<PlatoEntity>,
    ) {}

    async addDishToRestaurant(restaurantId: string, dishId: string): Promise<RestauranteEntity> {
        const dish = await this.platoRepository.findOne({ where: { id: dishId } });
        if (!dish) 
            throw new BusinessLogicException('El plato con el id dado no fue encontrado', BusinessError.NOT_FOUND);

        const restaurant = await this.restauranteRepository.findOne({ where: { id: restaurantId }, relations: ['platos'] });
        if (!restaurant) 
            throw new BusinessLogicException('El restaurante con el id dado no fue encontrado', BusinessError.NOT_FOUND);

        restaurant.platos = [...restaurant.platos, dish];
        return await this.restauranteRepository.save(restaurant);
    }

    async findDishesFromRestaurant(restaurantId: string): Promise<PlatoEntity[]> {
        const restaurant = await this.restauranteRepository.findOne({ where: { id: restaurantId }, relations: ['platos'] });
        if (!restaurant) 
            throw new BusinessLogicException('El restaurante con el id dado no fue encontrado', BusinessError.NOT_FOUND);

        return restaurant.platos;
    }

    async findDishFromRestaurant(restaurantId: string, dishId: string): Promise<PlatoEntity> {
        const restaurant = await this.restauranteRepository.findOne({ where: { id: restaurantId }, relations: ['platos'] });
        if (!restaurant) 
            throw new BusinessLogicException('El restaurante con el id dado no fue encontrado', BusinessError.NOT_FOUND);

        const dish = await this.platoRepository.findOne({ where: { id: dishId } });
        if (!dish) 
            throw new BusinessLogicException('El plato con el id dado no fue encontrado', BusinessError.NOT_FOUND);

        const restaurantDish = restaurant.platos.find((r) => r.id === dish.id);
        if (!restaurantDish) 
            throw new BusinessLogicException('El plato con el id dado no se encuentra en el restaurante', BusinessError.NOT_FOUND);

        return dish;
    }

    async updateDishesFromRestaurant(restaurantId: string, dishes: PlatoEntity[]): Promise<PlatoEntity[]> {
        const restaurant = await this.restauranteRepository.findOne({ where: { id: restaurantId }, relations: ['platos'] });
        if (!restaurant) 
            throw new BusinessLogicException('El restaurante con el id dado no fue encontrado', BusinessError.NOT_FOUND);

        for (const dish of dishes) {
            const persistedDish = await this.platoRepository.findOne({ where: { id: dish.id } });
            if (!persistedDish) 
                throw new BusinessLogicException('El plato con el id dado no fue encontrado', BusinessError.NOT_FOUND);
        }

        restaurant.platos = [...dishes];
        return await this.platoRepository.save(dishes);
    }

    async deleteDishFromRestaurant(restaurantId: string, dishId: string) {
        const restaurant = await this.restauranteRepository.findOne({ where: { id: restaurantId }, relations: ['platos'] });
        if (!restaurant) 
            throw new BusinessLogicException('El restaurante con el id dado no fue encontrado', BusinessError.NOT_FOUND);

        const dish = await this.platoRepository.findOne({ where: { id: dishId } });
        if (!dish) 
            throw new BusinessLogicException('El plato con el id dado no fue encontrado', BusinessError.NOT_FOUND);

        const restaurantDish = restaurant.platos.find((r) => r.id === dish.id);
        if (!restaurantDish) 
            throw new BusinessLogicException('El plato con el id dado no se encuentra en el restaurante', BusinessError.NOT_FOUND);

        restaurant.platos = restaurant.platos.filter((r) => r.id !== dish.id);
        await this.restauranteRepository.save(restaurant);
    }

}
