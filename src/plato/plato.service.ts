import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlatoEntity } from './plato.entity';
import { BusinessLogicException, BusinessError } from 'src/shared/errors/business-errors';

@Injectable()
export class PlatoService {
    constructor(
        @InjectRepository(PlatoEntity)
        private readonly platoRepository: Repository<PlatoEntity>,
    ){}

    async findAll(): Promise<PlatoEntity[]> { 
        return this.platoRepository.find({ relations: ['restaurantes'] });
    }

    async findOne(id: string): Promise<PlatoEntity> {
        const plato = await this.platoRepository.findOne({ where: {id}, relations: ['restaurantes'] });
        if (!plato) 
            throw new BusinessLogicException('El plato con el id dado no fue encontrado', BusinessError.NOT_FOUND);
        return plato;
    }

    async create(plato: PlatoEntity): Promise<PlatoEntity> {
        const listaTipos = ['entrada', 'plato fuerte', 'postre', 'bebida'];  
        if (!listaTipos.includes(plato.categoria) || plato.precio < 0) 
            throw new BusinessLogicException('El tipo de plato no es valido o el precio es menor a cero', BusinessError.PRECONDITION_FAILED);
        return await this.platoRepository.save(plato);
    }

    async update(id: string, plato: PlatoEntity): Promise<PlatoEntity> {
        const persistedPlato = await this.platoRepository.findOne({ where: {id} });
        if (!persistedPlato) 
            throw new BusinessLogicException('El plato con el id dado no fue encontrado', BusinessError.NOT_FOUND);

        const listaTipos = ['entrada', 'plato fuerte', 'postre', 'bebida'];
        if (!listaTipos.includes(plato.categoria) || plato.precio < 0) 
            throw new BusinessLogicException('El tipo de plato no es valido o el precio es menor a cero', BusinessError.PRECONDITION_FAILED);

        return await this.platoRepository.save({ ...persistedPlato, ...plato });
    }

    async delete(id: string) {
        const plato = await this.platoRepository.findOne({ where: {id} });
        if (!plato) 
            throw new BusinessLogicException('El plato con el id dado no fue encontrado', BusinessError.NOT_FOUND);
        await this.platoRepository.remove(plato);
    }


    
}
