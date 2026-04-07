import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import * as Mustache from 'mustache';
import * as fs from 'fs';
import * as path from 'path';
import { MAIL_QUEUE } from '../constants';

@Injectable()
export class MailService {
  private readonly templates = new Map<string, string>();

  constructor(@InjectQueue(MAIL_QUEUE) private readonly mailQueue: Queue) {
    this.loadTemplates();
  }

  private loadTemplates() {
    const templatesDir = path.join(
      process.cwd(),
      'libs/shared/src/mail/templates',
    );
    const files = fs.readdirSync(templatesDir);

    for (const file of files) {
      const name = path.basename(file, '.html');
      const content = fs.readFileSync(path.join(templatesDir, file), 'utf-8');
      this.templates.set(name, content);
    }
  }

  private render(template: string, data: Record<string, unknown>): string {
    const tpl = this.templates.get(template);
    if (!tpl) throw new Error(`Template "${template}" não encontrado`);
    return Mustache.render(tpl, {
      logoUrl:
        'https://oaok6yzuahtrgi7e.public.blob.vercel-storage.com/logo_white.png',
      ...data,
    });
  }

  async sendWelcome(email: string) {
    await this.mailQueue.add({
      to: email,
      subject: 'Bem-vindo ao Hireme!',
      html: this.render('welcome', { email }),
    });
  }

  async sendApplicationCreated(email: string, positionTitle: string) {
    await this.mailQueue.add({
      to: email,
      subject: `Candidatura registrada — ${positionTitle}`,
      html: this.render('application-created', { email, positionTitle }),
    });
  }

  async sendApplicationStatusUpdated(
    email: string,
    positionTitle: string,
    status: string,
  ) {
    await this.mailQueue.add({
      to: email,
      subject: `Atualização na candidatura — ${positionTitle}`,
      html: this.render('application-status-updated', {
        email,
        positionTitle,
        status,
      }),
    });
  }

  async sendInterviewScheduled(
    email: string,
    positionTitle: string,
    interviewTitle: string,
    scheduledAt: string,
    meetingUrl?: string,
  ) {
    await this.mailQueue.add({
      to: email,
      subject: `Entrevista agendada — ${positionTitle}`,
      html: this.render('interview-scheduled', {
        email,
        positionTitle,
        interviewTitle,
        scheduledAt,
        meetingUrl,
      }),
    });
  }
}
