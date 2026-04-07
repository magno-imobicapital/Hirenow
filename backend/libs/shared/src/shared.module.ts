import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { MAIL_QUEUE } from './constants';
import { PrismaService } from './database/prisma.service';
import { MailService } from './mail/mail.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        REDIS_PASSWORD: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().required(),
        BLOB_READ_WRITE_TOKEN: Joi.string().required(),
      }),
    }),

    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.getOrThrow<string>('REDIS_HOST'),
          port: configService.getOrThrow<number>('REDIS_PORT'),
          password: configService.getOrThrow<string>('REDIS_PASSWORD'),
        },
      }),
    }),

    // TODO: criar uma DLQ pra capturar jobs que esgotarem as 3 tentativas
    BullModule.registerQueue({
      name: MAIL_QUEUE,
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
      },
    }),
  ],
  providers: [PrismaService, MailService],
  exports: [BullModule, PrismaService, MailService],
})
export class SharedModule {}
