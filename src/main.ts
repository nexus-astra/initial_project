import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Set a global prefix for all routes
  app.setGlobalPrefix('api/v1');
  await app.listen(9000);
}
bootstrap();
