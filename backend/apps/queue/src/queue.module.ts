import { MAIL_QUEUE, SharedModule } from '@app/shared';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { SendMailProcessor } from './mail/send-mail.processor';

@Module({
  imports: [
    SharedModule,
    BullModule.registerQueue({
      name: MAIL_QUEUE,
    }),
  ],
  providers: [SendMailProcessor],
})
export class QueueModule {}
