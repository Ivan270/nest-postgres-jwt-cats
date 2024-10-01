import { Role } from "../../common/enums/role.enum";
import { applyDecorators, UseGuards } from "@nestjs/common";
import { Roles } from "./roles.decorator";
import { AuthGuard } from "../guard/auth.guard";
import { RolesGuard } from "../guard/roles.guard";

// ApplyDecorators permite aplicar múltiples decoradores y unirlos en uno solo
export function Auth(role: Role) {
  return applyDecorators(
    Roles(role),
    UseGuards(AuthGuard, RolesGuard)
  );
}