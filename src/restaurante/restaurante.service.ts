import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RestauranteEntity } from './restaurante.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class RestauranteService {
    constructor(
        @InjectRepository(RestauranteEntity)
        private readonly restauranteRepository: Repository<RestauranteEntity>,
    ) {}

    async findAll(): Promise<RestauranteEntity[]> {
        return this.restauranteRepository.find({ relations: ['platos'] });
    }

    async findOne(id: string): Promise<RestauranteEntity> {
        const restaurante = await this.restauranteRepository.findOne({ where: {id}, relations: ['platos'] });
        if (!restaurante) 
            throw new BusinessLogicException('El restaurante con el id dado no fue encontrado', BusinessError.NOT_FOUND);
        return restaurante;
    }

    async create(restaurante: RestauranteEntity): Promise<RestauranteEntity> {
        const listaCocinas = ['Italiana', 'Japonesa', 'Mexicana', 'Colombiana', 'India', 'Internacional'];  
        if (!listaCocinas.includes(restaurante.tipoCocina)) 
            throw new BusinessLogicException('El tipo de cocina no es valido', BusinessError.PRECONDITION_FAILED);
        return await this.restauranteRepository.save(restaurante);
    }

    async update(id: string, restaurante: RestauranteEntity): Promise<RestauranteEntity> {
        const persistedRestaurante = await this.restauranteRepository.findOne({ where: {id} });
        if (!persistedRestaurante) 
            throw new BusinessLogicException('El restaurante con el id dado no fue encontrado', BusinessError.NOT_FOUND);

        const listaCocinas = ['Italiana', 'Japonesa', 'Mexicana', 'Colombiana', 'India', 'Internacional'];
        if (!listaCocinas.includes(restaurante.tipoCocina)) 
            throw new BusinessLogicException('El tipo de cocina no es valido', BusinessError.PRECONDITION_FAILED);

        return await this.restauranteRepository.save({ ...persistedRestaurante, ...restaurante });
    }

    async delete(id: string) {
        const restaurante = await this.restauranteRepository.findOne({ where: {id} });
        if (!restaurante) 
            throw new BusinessLogicException('El restaurante con el id dado no fue encontrado', BusinessError.NOT_FOUND);
        await this.restauranteRepository.remove(restaurante);
    }
}
