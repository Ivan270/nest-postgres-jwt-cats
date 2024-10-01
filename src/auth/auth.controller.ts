import { Body, Controller, Get, Post, UseGuards, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { Request } from "express";
import { Auth } from "./decorators/auth.decorator";
import { Role } from "../common/enums/role.enum";
import { ActiveUser } from "../common/decorators/active-user.decorator";
import { ActiveUserInterface } from "../common/iterfaces/active-user.interface";

interface RequestWithUser extends Request {
  user: {
    email: string;
    role: string;
  };
}

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {
  }

  @Post("register")
  register(
    @Body()
      registerDto: RegisterDto
  ) {
    return this.authService.register(registerDto);
  }

  @Post("login")
  login(
    @Body()
      loginDto: LoginDto
  ) {
    return this.authService.login(loginDto);
  }

  @Get("profile")

  // Decorador personalizado para Roles
  // @Roles(Role.ADMIN)
  // @UseGuards(AuthGuard, RolesGuard)
  // Se reemplazaron las dos líneas anteriores por la siguiente para poder unir los decoradores
  @Auth(Role.USER)
  // Se añade al tipo 'Request' de express una propiedad llamada 'user' con sus respectivos datos
  // profile(@Req() req: Request & { user: { email: string, password: string } }) {
  // Pero se preferirá crear una interfaz propia para este caso

  // Se incluye decorador personalizado ActiveUser, que se encarga de obtener el usuario del request
  profile(@ActiveUser() user: ActiveUserInterface) {
    return this.authService.profile(user);
  }
}
