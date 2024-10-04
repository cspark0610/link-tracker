import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';

function isNotProduction(): boolean {
  return process.env.NODE_ENV !== 'production';
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') || 3000;

  app.useLogger(app.get(Logger));

  if (isNotProduction()) {
    const { initSwagger } = await import('./app.swagger');
    await initSwagger(app);
    console.log(`Swagger document generated: http://localhost:${PORT}/docs`);
  }
  await app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on http://localhost:${PORT}`);
  });
}
bootstrap();
