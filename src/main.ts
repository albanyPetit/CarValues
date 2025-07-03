import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; //para validar datos de una request

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //detalle de seguridad. elimina los atributos extras ingresados por el usuario en el request y que no son los especificados
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
