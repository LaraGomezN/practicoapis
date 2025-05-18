import { Controller, Get, UseInterceptors, Post, Param, Body, Put, Delete, HttpCode } from '@nestjs/common';
import { PlatoService } from './plato.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { PlatoDto } from './plato.dto';
import { PlatoEntity } from './plato.entity';
import { plainToInstance } from 'class-transformer';

@Controller('platos')
@UseInterceptors(BusinessErrorsInterceptor)
export class PlatoController {
    constructor(private readonly platoService: PlatoService) {}

    @Get()
    async findAll() {
        return await this.platoService.findAll();
    }

    @Get(':platoId')
    async findOne(@Param('platoId') platoId: string) {
        return await this.platoService.findOne(platoId);
    }

    @Post()
    async create(@Body() platoDto: PlatoDto) {
        const plato: PlatoEntity = plainToInstance(PlatoEntity, platoDto);
        return await this.platoService.create(plato);
    }

    @Put(':platoId')
    async update(@Param('platoId') platoId: string, @Body() platoDto: PlatoDto) {
        const plato: PlatoEntity = plainToInstance(PlatoEntity, platoDto);
        return await this.platoService.update(platoId, plato);
    }   

    @Delete(':platoId')
    @HttpCode(204)
    async delete(@Param('platoId') platoId: string) {
        return await this.platoService.delete(platoId);
    }

}
