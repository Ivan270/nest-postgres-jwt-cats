import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { CatsService } from "./cats.service";
import { CreateCatDto } from "./dto/create-cat.dto";
import { UpdateCatDto } from "./dto/update-cat.dto";
import { Auth } from "../auth/decorators/auth.decorator";
import { Role } from "../common/enums/role.enum";
import { ActiveUser } from "../common/decorators/active-user.decorator";
import { ActiveUserInterface } from "../common/iterfaces/active-user.interface";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";


@ApiTags("Cats") // Documentación de la ruta
@ApiBearerAuth() // Autenticación de la ruta (token JWT)
@ApiUnauthorizedResponse({ // Para detallar el error de autenticación en la documentación
  description: "This API requires an authenticated user.",
})
@Auth(Role.USER) // Todas las rutas 'cats' necesitarán el rol de usuario
@Controller("cats")
export class CatsController {
  constructor(private readonly catsService: CatsService) {
  }

  @Post()
  @ApiCreatedResponse({description: "The Cat has been successfully created"})
  @ApiForbiddenResponse({description: "Forbidden"})
  create(@Body() createCatDto: CreateCatDto, @ActiveUser() user: ActiveUserInterface) {
    return this.catsService.create(createCatDto, user);
  }

  @Get()
  findAll(@ActiveUser() user: ActiveUserInterface) {
    return this.catsService.findAll(user);
  }

  @Get(":id")
  findOne(@Param("id") id: number, @ActiveUser() user: ActiveUserInterface) {
    return this.catsService.findOne(id, user);
  }

  @Patch(":id")
  update(@Param("id") id: number, @Body() updateCatDto: UpdateCatDto, @ActiveUser() user: ActiveUserInterface) {
    return this.catsService.update(id, updateCatDto, user);
  }

  @Delete(":id")
  remove(@Param("id"
  ) id: number, @ActiveUser() user: ActiveUserInterface) {
    return this.catsService.remove(id, user);
  }
}
