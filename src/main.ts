import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api/v1");

  // Validar de forma global datos de entrada.
  // Que si usuario envía datos no correspondientes de error
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      // Transformar datos siempre que se pueda (por ej. id de tipo numérico)
      transform: true
    })
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle("Cat API Example")
    .setDescription("API developed with NestJS, TypeScript, PostgreSQL, TypeORM and Swagger")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // Para la documentación se utilizará la ruta /docs indicada abajo
  SwaggerModule.setup('docs', app, document);

  await app.listen(parseInt(process.env.PORT) || 3000);
}

bootstrap();
