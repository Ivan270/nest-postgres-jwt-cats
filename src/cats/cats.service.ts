import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateCatDto } from "./dto/create-cat.dto";
import { UpdateCatDto } from "./dto/update-cat.dto";
import { Repository } from "typeorm";
import { Cat } from "./entities/cat.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Breed } from "../breeds/entities/breed.entity";
import { ActiveUserInterface } from "../common/iterfaces/active-user.interface";
import { Role } from "../common/enums/role.enum";

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private readonly catRepository: Repository<Cat>,
    @InjectRepository(Breed)
    private readonly breedRepository: Repository<Breed>
  ) {
  }

  async create(createCatDto: CreateCatDto, user: ActiveUserInterface) { // usuario se obtendrá del decorador personalizado @ActiveUser()
    const breed = await this.validateBreed(createCatDto.breed);

    const cat: Cat = this.catRepository.create({
      name: createCatDto.name,
      age: createCatDto.age,
      userEmail: user.email,
      breed
    });
    return await this.catRepository.save(cat);
    // return await this.catRepository.save(createCatDto);
  }

  async findAll(user: ActiveUserInterface) {
    if (user.role === Role.ADMIN) {
      return await this.catRepository.find();
    }
    return await this.catRepository.find({
      where: { userEmail: user.email }
    });
  }

  async findOne(id: number, user: ActiveUserInterface) {
    // validar existencia del gato
    const cat = await this.catRepository.findOneBy({ id });
    if (!cat) {
      throw new BadRequestException("Cat not found");
    }

    // validar que el usuario sea el dueño del gato
    this.validateCatOwnership(cat, user);

    return cat;
  }

  async update(id: number, updateCatDto: UpdateCatDto, user: ActiveUserInterface) {
    await this.findOne(id, user);

    return await this.catRepository.update(id, {
      ...updateCatDto,
      breed: updateCatDto.breed ? await this.validateBreed(updateCatDto.breed) : undefined,
      userEmail: user.email
    });
  }

  async remove(id: number, user: ActiveUserInterface) {
    await this.findOne(id, user);

    // soft delete le pone fecha a la columna deletedAt. Y al listar todos los cats,
    // se filtra por deletedAt === null, es decir que no aparecerá.
    return this.catRepository.softDelete({ id });
  }

  private validateCatOwnership(cat: Cat, user: ActiveUserInterface) {
    if (user.role !== Role.ADMIN && cat.userEmail !== user.email) {
      throw new UnauthorizedException();
    }
  }

  private async validateBreed(breed: string) {
    const breedEntity = await this.breedRepository.findOneBy({ name: breed });
    if (!breedEntity) {
      throw new BadRequestException("Breed not found");
    }

    return breedEntity;
  }
}
