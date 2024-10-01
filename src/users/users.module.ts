import { forwardRef, Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { AuthModule } from "../auth/auth.module";

@Module({
  // Se utiliza forwardRef porque son módulos circulares. Dependen el uno del otro.
  imports: [TypeOrmModule.forFeature([User]), forwardRef(()=>AuthModule)],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {
}
