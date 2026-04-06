import { MAIL_QUEUE } from '@app/shared';
import { Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Job } from 'bull';
import { Resend } from 'resend';

export interface SendMailJobData {
  to: string | string[];
  subject: string;
  html: string;
}

@Processor(MAIL_QUEUE)
export class SendMailProcessor {
  private readonly logger = new Logger(SendMailProcessor.name);
  private readonly resend: Resend;

  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));
  }

  @Process()
  async handle(job: Job<SendMailJobData>) {
    const { to, subject, html } = job.data;

    this.logger.log(`Sending email to ${to} — subject: "${subject}"`);

    const { error } = await this.resend.emails.send({
      from: 'HireNow <onboarding@resend.dev>',
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    });

    if (error) {
      this.logger.error(`Failed to send email: ${error.message}`);
      throw new Error(error.message);
    }

    this.logger.log(`Email sent to ${to}`);
  }
}
