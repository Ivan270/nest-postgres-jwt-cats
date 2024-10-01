import { IsEmail, IsString, MinLength } from "class-validator";
import { Transform } from "class-transformer";

export class RegisterDto {
  // Para limpiar espacios en blanco. Validar siempre primero
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  // Para limpiar espacios en blanco. Validar siempre primero
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(6)
  password: string;
}