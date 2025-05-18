import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantePlatoService } from './restaurante-plato.service';
import { RestauranteEntity } from 'src/restaurante/restaurante.entity';
import { PlatoEntity } from 'src/plato/plato.entity';


@Module({
 imports: [TypeOrmModule.forFeature([RestauranteEntity, PlatoEntity])],
 providers: [RestaurantePlatoService],
})
export class RestaurantePlatoModule {}