import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PlatoService } from './plato.service';
import { PlatoEntity } from './plato.entity';
import { faker } from '@faker-js/faker';


describe('PlatoService', () => {
  let service: PlatoService;
  let repository: Repository<PlatoEntity>;
  let platosList: PlatoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PlatoService],
    }).compile();

    service = module.get<PlatoService>(PlatoService);
    repository = module.get<Repository<PlatoEntity>>(getRepositoryToken(PlatoEntity));
  });

  const seedDatabase = async () => {
    await repository.clear();
    platosList = [];
    const categorias = ["entrada", "plato fuerte", "postre", "bebida"];
    for(let i = 0; i < 5; i++){
        const plato: PlatoEntity = await repository.save({
          nombre: faker.company.name(),
          descripcion: faker.lorem.sentence(),
          precio: faker.number.int({ min: 0 }),
          categoria: categorias[Math.floor(Math.random() * categorias.length)]
        });
        platosList.push(plato);
    }
  } 

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all platos', async () => {
    await seedDatabase();
    const platos: PlatoEntity[] = await service.findAll();
    expect(platos).not.toBeNull();
    expect(platos).toHaveLength(platosList.length);
  });

  it('findOne should return a plato by id', async () => {
    await seedDatabase();
    const plato: PlatoEntity = platosList[0];
    const foundPlato: PlatoEntity = await service.findOne(plato.id);
    expect(foundPlato).not.toBeNull();
    expect(foundPlato.nombre).toEqual(plato.nombre);
    expect(foundPlato.descripcion).toEqual(plato.descripcion);
    expect(foundPlato.precio).toEqual(plato.precio);
  });

  it('findOne should throw an exception for an invalid plato', async () => {
    await seedDatabase();
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El plato con el id dado no fue encontrado");
  });

  it('create should return a new plato', async () => {
    const plato: PlatoEntity = {
      id: "",
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      precio: faker.number.int({ min: 0 }),
      categoria: "entrada",
      restaurantes: []
    }

    const newPlato: PlatoEntity = await service.create(plato);
    expect(newPlato).not.toBeNull();

    const storedPlato = await repository.findOne({ where: { id: newPlato.id } });
    expect(storedPlato).not.toBeNull();
    expect(storedPlato!.nombre).toEqual(newPlato.nombre);
    expect(storedPlato!.descripcion).toEqual(newPlato.descripcion);
    expect(storedPlato!.precio).toEqual(newPlato.precio);
  });

  it('create should throw an exception for an invalid plato', async () => {
    const plato: PlatoEntity = {
      id: "",
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      precio: faker.number.int({ min: 0 }),
      categoria: "entrada",
      restaurantes: []
    }

    plato.categoria = "invalid_categoria";
    await expect(() => service.create(plato)).rejects.toHaveProperty("message", "El tipo de plato no es valido o el precio es menor a cero");
  });

  it('update should modify a plato', async () => {
    await seedDatabase();
    const plato: PlatoEntity = platosList[0];
    plato.nombre = "New name";
    plato.descripcion = "New description";
    plato.precio = 100;
    const updatedPlato: PlatoEntity = await service.update(plato.id, plato);
    expect(updatedPlato).not.toBeNull();

    const storedPlato: PlatoEntity | null = await repository.findOne({ where: { id: plato.id } });
    expect(storedPlato).not.toBeNull();
    expect(storedPlato!.nombre).toEqual(plato.nombre);
    expect(storedPlato!.descripcion).toEqual(plato.descripcion);
    expect(storedPlato!.precio).toEqual(plato.precio);
  });

  it('update should throw an exception for an invalid plato', async () => {
    await seedDatabase();
    let plato: PlatoEntity = platosList[0];
    plato = {
      ...plato, nombre: "New name", descripcion: "New description", precio: 100
    }
    plato.categoria = "invalid_categoria";
    await expect(() => service.update(plato.id, plato)).rejects.toHaveProperty("message", "El tipo de plato no es valido o el precio es menor a cero");
  });

  it('delete should remove a plato', async () => {
    await seedDatabase();
    const plato: PlatoEntity = platosList[0];
    await service.delete(plato.id);

    const deletedPlato: PlatoEntity | null = await repository.findOne({ where: { id: plato.id } });
    expect(deletedPlato).toBeNull();
  });

  it('delete should throw an exception for an invalid plato', async () => {
    await seedDatabase();
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El plato con el id dado no fue encontrado");
  });



  

});
