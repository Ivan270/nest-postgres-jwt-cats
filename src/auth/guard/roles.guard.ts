import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { Role } from "../../common/enums/role.enum";

// Para acceder a metadatos se necesitará el módulo Reflector

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private readonly reflector: Reflector) {
  }

  canActivate(
    context: ExecutionContext
  ): boolean {
    // getAllAndOverride() debe recibir dos parámetros: metadataKey (nombre clave como se almacenan los metadatos en el controller, en este caso 'roles')
    // y metatype (arreglo que contiene los elementos que entregarán metadatos.
    const role: Role = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    // En caso de que en el decorador no se especifique un rol, se devuelve true
    if(!role){
      return true
    }

    // Compara el rol del usuario (proveniente del request) con el rol del decorador
    const {user} = context.switchToHttp().getRequest()

    // Para que usuarios admin puedan ingresar a cualquier ruta. En este caso es necesario.
    if (user.role == Role.ADMIN) return true

    return role === user.role;
  }
}
