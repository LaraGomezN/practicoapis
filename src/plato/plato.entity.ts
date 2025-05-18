import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PlatoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    descripcion: string;

    @Column({type: 'int'})
    precio: number;

    @Column()
    categoria: string;

    
}
