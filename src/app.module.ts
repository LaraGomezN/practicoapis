import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestauranteModule } from './restaurante/restaurante.module';
import { PlatoModule } from './plato/plato.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatoEntity } from './plato/plato.entity';
import { RestauranteEntity } from './restaurante/restaurante.entity';
import { RestaurantePlatoService } from './restaurante-plato/restaurante-plato.service';
import { RestaurantePlatoModule } from './restaurante-plato/restaurante-plato.module';

@Module({
  imports: [RestauranteModule, PlatoModule, RestaurantePlatoModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'practicoapis',
      entities: [PlatoEntity, RestauranteEntity],
      synchronize: true,
      dropSchema: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
