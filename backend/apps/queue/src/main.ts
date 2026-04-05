import { NestFactory } from '@nestjs/core';
import { QueueModule } from './queue.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(QueueModule);
  const config = app.get(ConfigService);
  await app.listen(config.getOrThrow<number>('QUEUE_PORT'));
}
bootstrap();
