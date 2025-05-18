import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { RestauranteService } from './restaurante.service';
import { RestauranteEntity } from './restaurante.entity';
import { faker } from '@faker-js/faker';

describe('RestauranteService', () => {
 let service: RestauranteService;
 let repository: Repository<RestauranteEntity>;
 let restaurantesList: RestauranteEntity[];

 beforeEach(async () => {
   const module: TestingModule = await Test.createTestingModule({
     imports: [...TypeOrmTestingConfig()],
     providers: [RestauranteService],
   }).compile();

   service = module.get<RestauranteService>(RestauranteService);
   repository = module.get<Repository<RestauranteEntity>>(getRepositoryToken(RestauranteEntity));
 });

  const seedDatabase = async () => {
    await repository.clear();
    restaurantesList = [];
    const tiposCocina = ['Italiana', 'Mexicana', 'Colombiana', 'Japonesa', 'India', 'Internacional']; 
    for(let i = 0; i < 5; i++){
        const plato: RestauranteEntity = await repository.save({
          nombre: faker.company.name(),
          direccion: faker.location.streetAddress(),
          tipoCocina: tiposCocina[Math.floor(Math.random() * tiposCocina.length)],
          paginaWeb: faker.internet.url()});
        restaurantesList.push(plato);
    }
  } 
  
 it('should be defined', () => {
   expect(service).toBeDefined();
 });

  it('findAll should return all restaurantes', async () => {
    await seedDatabase();
    const restaurantes: RestauranteEntity[] = await service.findAll();
    expect(restaurantes).not.toBeNull();
    expect(restaurantes).toHaveLength(restaurantesList.length);
  });

  it('findOne should return a restaurante by id', async () => {
      await seedDatabase();
      const restaurante: RestauranteEntity = restaurantesList[0];
      const foundRestaurante: RestauranteEntity = await service.findOne(restaurante.id);
      expect(foundRestaurante).not.toBeNull();
      expect(foundRestaurante.nombre).toEqual(restaurante.nombre);
      expect(foundRestaurante.direccion).toEqual(restaurante.direccion);
      expect(foundRestaurante.tipoCocina).toEqual(restaurante.tipoCocina);
    });

  it('findOne should throw an exception for an invalid restaurante', async () => {
    await seedDatabase();
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El restaurante con el id dado no fue encontrado");
  });

  it('create should return a new restaurante', async () => {
    const restaurante: RestauranteEntity = {
      id: "",
      nombre: faker.company.name(),
      direccion: faker.location.streetAddress(),
      tipoCocina: "Italiana",
      paginaWeb: faker.internet.url(),
      platos: []
    }
    const newRestaurante: RestauranteEntity = await service.create(restaurante);
    expect(newRestaurante).not.toBeNull();

    const storedRestaurante= await repository.findOne({ where: { id: newRestaurante.id } });
    expect(storedRestaurante).not.toBeNull();
    expect(storedRestaurante!.nombre).toEqual(newRestaurante.nombre);
    expect(storedRestaurante!.direccion).toEqual(newRestaurante.direccion);
    expect(storedRestaurante!.tipoCocina).toEqual(newRestaurante.tipoCocina);
  });

it('create should throw an exception for an invalid tipoCocina', async () => {
  const restaurante: RestauranteEntity = {
    id: "",
    nombre: faker.company.name(),
    direccion: faker.location.streetAddress(),
    tipoCocina: "Francesa",
    paginaWeb: faker.internet.url(),
    platos: []
  }
  await expect(() => service.create(restaurante)).rejects.toHaveProperty(
    "message",
    "El tipo de cocina no es valido"
  );
});

  it('update should modify a restaurante', async () => {
    await seedDatabase();
    const restaurante: RestauranteEntity = restaurantesList[0];
    restaurante.nombre = "Nuevo nombre";
    const updatedRestaurante: RestauranteEntity = await service.update(restaurante.id, restaurante);
    expect(updatedRestaurante).not.toBeNull();
    const storedRestaurante = await repository.findOne({ where: { id: restaurante.id } });
    expect(storedRestaurante).not.toBeNull();
    expect(storedRestaurante!.nombre).toEqual(restaurante.nombre);
  });

  it('update should throw an exception for an invalid restaurante', async () => {
    await seedDatabase();
    let restaurante: RestauranteEntity = restaurantesList[0];
    restaurante = {
      ...restaurante, nombre: "Nuevo nombre"
    }
    await expect(() => service.update("0", restaurante)).rejects.toHaveProperty("message", "El restaurante con el id dado no fue encontrado");
  });

  it('delete should remove a restaurante', async () => {
    await seedDatabase();
    const restaurante: RestauranteEntity = restaurantesList[0];
    await service.delete(restaurante.id);
    const deletedRestaurante = await repository.findOne({ where: { id: restaurante.id } });
    expect(deletedRestaurante).toBeNull();
  });

  it('delete should throw an exception for an invalid restaurante', async () => {
    await seedDatabase();
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El restaurante con el id dado no fue encontrado");
  });


});
