import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { RestauranteService } from './restaurante.service';
import { RestauranteEntity } from './restaurante.entity';

describe('RestauranteService', () => {
 let service: RestauranteService;
 let repository: Repository<RestauranteEntity>;

 beforeEach(async () => {
   const module: TestingModule = await Test.createTestingModule({
     imports: [...TypeOrmTestingConfig()],
     providers: [RestauranteService],
   }).compile();

   service = module.get<RestauranteService>(RestauranteService);
   repository = module.get<Repository<RestauranteEntity>>(getRepositoryToken(RestauranteEntity));
 });
  
 it('should be defined', () => {
   expect(service).toBeDefined();
 });

});
