import { MAIL_QUEUE } from '@app/shared';
import { Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Job } from 'bull';

export interface SendMailJobData {
  to: string | string[];
  subject: string;
  html: string;
}

@Processor(MAIL_QUEUE)
export class SendMailProcessor {
  private readonly logger = new Logger(SendMailProcessor.name);
  private readonly webhookUrl: string;

  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    this.webhookUrl =
      this.configService.getOrThrow<string>('MAIL_WEBHOOK_URL');
  }

  @Process()
  async handle(job: Job<SendMailJobData>) {
    const { to, subject, html } = job.data;

    this.logger.log(`Sending email to ${to} — subject: "${subject}"`);

    const response = await fetch(this.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject, html }),
    });

    if (!response.ok) {
      const body = await response.text();
      this.logger.error(`Failed to send email: ${response.status} ${body}`);
      throw new Error(`Mail webhook returned ${response.status}`);
    }

    this.logger.log(`Email sent to ${to}`);
  }
}
