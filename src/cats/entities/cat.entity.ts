import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Breed } from "../../breeds/entities/breed.entity";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Cat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  age: number;

  // @Column()
  // breed: string;
  //   Relaciones con entidad Breed
  //   En primera funcion de flecha, se recibe la entidad con la que se quiere relacionar
  @ManyToOne(() => Breed, (breed) => breed.id, {
    eager: true // para traer las razas al hacer findOne
  })
  breed: Breed;

  // Join column define qué lado de la relación contiene la columna con una clave externa, también
  // permite personalizar el nombre de la columna de combinación y el nombre de la columna de referencia
  // Se realiza de esta forma (a diferencia de breed) para no tener que entregarla una instancia de Usuario
  // cada vez que se crea una instancia de Cat, solo se le pasa el email.
  @ManyToOne(() => User)
  @JoinColumn({ name: "userEmail", referencedColumnName: "email" })
  user: User;

  @Column()
  userEmail: string;

  @DeleteDateColumn()
  deletedAt: Date;
}
