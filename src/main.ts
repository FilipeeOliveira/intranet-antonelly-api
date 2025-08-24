import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { swaggerDescription, swaggerOptions, swaggerTitle } from './common';
import dotenv from 'dotenv';
import { envConfig } from './config/config';

dotenv.config();

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true }
    })
  );

  const config = new DocumentBuilder()
    .setTitle(swaggerTitle)
    .setDescription(swaggerDescription)
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, swaggerOptions);


  //Enable CORS
  app.enableCors();

  const PORT = envConfig.PORT || 3000;
  await app.listen(PORT);
  console.log('\n')
  Logger.debug(`App running on 🚀 http://localhost:${PORT} 🚀`);
  Logger.debug(`Swagger running on 📃 http://localhost:${PORT}/api 📃`);
  console.log('\n')



}
bootstrap();


