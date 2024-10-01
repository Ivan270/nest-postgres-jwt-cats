import { SetMetadata } from "@nestjs/common";
import { Role } from "../../common/enums/role.enum";

// SetMetadata permitirá agregar información al request.
// Recibe 2 parametros: Key y value
export const ROLES_KEY = "roles";
export const Roles = (role: Role) => SetMetadata(ROLES_KEY, role);