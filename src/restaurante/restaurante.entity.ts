import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
