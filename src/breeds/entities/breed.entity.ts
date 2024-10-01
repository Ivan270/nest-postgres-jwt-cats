import { Column, DeleteDateColumn, Entity, OneToMany } from "typeorm";
import { Cat } from "../../cats/entities/cat.entity";

@Entity()
export class Breed {
  @Column({ primary: true, generated: true })
  id: number;
  @Column({ length: 500, unique: true })
  name: string;

//   Relaciones con entidad Gato
  @OneToMany(() => Cat, (cat) => cat.breed)
  cats: Cat[];

  @DeleteDateColumn()
  deletedAt: Date;
}
