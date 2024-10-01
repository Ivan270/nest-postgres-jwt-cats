import { Column, DeleteDateColumn, Entity } from "typeorm";
import { Role } from "../../common/enums/role.enum";
// import { Exclude } from "class-transformer";

@Entity()
export class User {
  @Column({ primary: true, generated: true })
  id: number;

  @Column()
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false, select: false })
    // @Exclude()
  password: string;

  // Se indica que la columna será de tipo enum,
  // tercer parámetro permite que el valor 'default' pertenezca al enum Role
  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @DeleteDateColumn()
  deletedAt: Date;
}
