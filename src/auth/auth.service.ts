import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { RegisterDto } from "./dto/register.dto";
import * as bcrypt from "bcryptjs";
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import { instanceToPlain } from "class-transformer";
import { User } from "../users/entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    // Al no inyectar el repositorio de usuarios, no se contacta
    // directamente con la base de datos.
    // Por eso se necesita el servicio de usuarios
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {
  }

  async register(registerDto: RegisterDto) {
    const { name, email, password } = registerDto;
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      throw new BadRequestException("El usuario ya existe");
    }
    await this.usersService.create({
      name,
      email,
      password: await bcrypt.hash(password, 10)
    });

    return {
      name,
      email
    };

  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersService.findOneByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedException("Email incorrecto.");
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new UnauthorizedException("Contraseña incorrecta.");
    }

    //  Este payload contiene información PÚBLICA del usuario, que se encontrará en el token
    const payload = { email: user.email, role: user.role };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      email
    };
  }

  async profile({ email, role }: { email: string; role: string }) {
    // Método tradicional de chequeo de autorización basado en rol, pero no el óptimo
    // if (role !== "admin") {
    //   throw new UnauthorizedException("No está autorizado a acceder a este recurso.");
    // }

    // Los métodos debajo permiten retornar un objeto sin la información privada (en este caso el password)
    const user = await this.usersService.findOneByEmail(email);
    return instanceToPlain(user);
  }
}
