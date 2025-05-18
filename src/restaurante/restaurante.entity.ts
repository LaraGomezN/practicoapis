import { PlatoEntity } from '../plato/plato.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RestauranteEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    direccion: string;

    @Column()
    tipoCocina: string;

    @Column()
    paginaWeb: string;

    @ManyToMany(() => PlatoEntity, (plato) => plato.restaurantes)
    // Restaurante va a ser la duena de la relacion
    @JoinTable()
    platos: PlatoEntity[];
}
