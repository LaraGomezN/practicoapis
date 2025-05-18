import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantePlatoService } from './restaurante-plato.service';
import { Repository } from 'typeorm';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { PlatoEntity } from '../plato/plato.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { fa, faker } from '@faker-js/faker/.';

describe('RestaurantePlatoService', () => {
  let service: RestaurantePlatoService;
  let restauranteRepository: Repository<RestauranteEntity>;
  let platoRepository: Repository<PlatoEntity>;
  let restaurante: RestauranteEntity;
  let platosList: PlatoEntity[];


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RestaurantePlatoService],
    }).compile();

    service = module.get<RestaurantePlatoService>(RestaurantePlatoService);
    restauranteRepository = module.get<Repository<RestauranteEntity>>(getRepositoryToken(RestauranteEntity));
    platoRepository = module.get<Repository<PlatoEntity>>(getRepositoryToken(PlatoEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await restauranteRepository.clear();
    await platoRepository.clear();

    platosList = [];
    for (let i = 0; i < 5; i++) {
      const plato: PlatoEntity = await platoRepository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
        precio: faker.number.int({ min: 0 }),
        categoria: 'entrada',
      });
      platosList.push(plato);
    }

      restaurante = await restauranteRepository.save({
        nombre: faker.company.name(),
        direccion: faker.location.streetAddress(),
        tipoCocina: 'Italiana',
        paginaWeb: faker.internet.url(),
        platos: platosList
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addDishToRestaurant should add a plato to a restaurante', async () => {
    const newPlato: PlatoEntity = await platoRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      precio: faker.number.int({ min: 0 }),
      categoria: 'entrada',
    });

    const result = await service.addDishToRestaurant(restaurante.id, newPlato.id);
    expect(result.platos).not.toBeNull();
    expect(result.platos).toHaveLength(platosList.length + 1);
  });

  it('findDishesFromRestaurant should return platos from a restaurante', async () => {
    const result = await service.findDishesFromRestaurant(restaurante.id);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(platosList.length);
  });

  it('findDishFromRestaurant should return a plato from a restaurante', async () => {
    const result = await service.findDishFromRestaurant(restaurante.id, platosList[0].id);
    expect(result).not.toBeNull();
    expect(result.nombre).toEqual(platosList[0].nombre);
  });

  it('findDishFromRestaurant should throw an exception for an invalid plato', async () => {
    await expect(() => service.findDishFromRestaurant(restaurante.id, '0')).rejects.toHaveProperty(
      'message',
      'El plato con el id dado no fue encontrado',
    );
  });

  it('updateDishesFromRestaurant should update platos from a restaurante', async () => {
    const newPlato: PlatoEntity = await platoRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      precio: faker.number.int({ min: 0 }),
      categoria: 'entrada',
    });

    const result = await service.updateDishesFromRestaurant(restaurante.id, [newPlato]);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(1);
  });

  it('deleteDishFromRestaurant should remove a plato from a restaurante', async () => {
    await service.deleteDishFromRestaurant(restaurante.id, platosList[0].id);

    const updatedRestaurant = await restauranteRepository.findOne({
      where: { id: restaurante.id },
      relations: ['platos'],
    });

    expect(updatedRestaurant).not.toBeNull();
    expect(updatedRestaurant!.platos).toHaveLength(platosList.length - 1);
    expect(updatedRestaurant!.platos.find(p => p.id === platosList[0].id)).toBeUndefined();
  });

  it('deleteDishFromRestaurant should throw an exception for an invalid plato', async () => {
    await expect(() => service.deleteDishFromRestaurant(restaurante.id, '0')).rejects.toHaveProperty(
      'message',
      'El plato con el id dado no fue encontrado',
    );
  });

  it('deleteDishFromRestaurant should throw an exception for an invalid restaurante', async () => {
    const newPlato: PlatoEntity = await platoRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      precio: faker.number.int({ min: 0 }),
      categoria: 'entrada',
    });

    await expect(() => service.deleteDishFromRestaurant('0', newPlato.id)).rejects.toHaveProperty(
      'message',
      'El restaurante con el id dado no fue encontrado',
    );
  });

});
