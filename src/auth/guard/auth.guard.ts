import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "../constants/jwt.constant";

@Injectable()
export class AuthGuard implements CanActivate {
  // CanActivate es un método de nest que se ejecuta antes de una petición
  constructor(
    private readonly jwtService: JwtService
  ) {
  }

  async canActivate(
    context: ExecutionContext
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException("No se han entregado datos de autenticación");
    }

    try {
      // Validar el token
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: jwtConstants.secret
        }
      );

      // Se agrega al request el usuario que devuelve el payload para que pueda ser usado en las rutas
      request.user = payload;

    } catch {
      throw new UnauthorizedException("No estás autorizado");
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
