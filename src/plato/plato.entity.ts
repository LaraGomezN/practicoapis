import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RestauranteEntity } from '../restaurante/restaurante.entity';

@Entity()
export class PlatoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;

    @Column({type: 'int'})
    precio: number;

    @Column()
    categoria: string;

    @ManyToMany(() => RestauranteEntity, (restaurante) => restaurante.platos)
    restaurantes: RestauranteEntity[];


}
