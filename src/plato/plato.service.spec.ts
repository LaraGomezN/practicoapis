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



  

});
