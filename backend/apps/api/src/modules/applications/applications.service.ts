import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService, PrismaService } from '@app/shared';
import { put } from '@vercel/blob';
import { randomUUID } from 'crypto';

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  async apply(positionId: string, userId: string) {
    const position = await this.prisma.position.findUnique({
      where: { id: positionId },
    });

    if (!position || !position.isActive) {
      throw new NotFoundException('Posição não encontrada ou encerrada');
    }

    const existing = await this.prisma.application.findUnique({
      where: { userId_positionId: { userId, positionId } },
    });

    if (existing) {
      throw new ConflictException('Você já se candidatou a esta vaga');
    }

    const [application, user] = await Promise.all([
      this.prisma.application.create({ data: { userId, positionId } }),
      this.prisma.user.findUnique({ where: { id: userId } }),
    ]);

    if (user) {
      await this.mailService.sendApplicationCreated(user.email, position.title);
    }

    return {
      id: application.id,
      positionId: application.positionId,
      status: application.status,
      createdAt: application.createdAt,
    };
  }

  async findByUser(userId: string) {
    return this.prisma.application.findMany({
      where: { userId },
      select: {
        id: true,
        status: true,
        createdAt: true,
        contractToken: true,
        contractSignedAt: true,
        position: {
          select: {
            id: true,
            title: true,
            employmentType: true,
            location: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: string) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: {
        user: { include: { profile: true } },
        position: true,
      },
    });

    if (!application) {
      throw new NotFoundException('Candidatura não encontrada');
    }

    const TERMINAL_STATUSES = ['WITHDRAWN', 'HIRED', 'REJECTED'];
    if (TERMINAL_STATUSES.includes(application.status)) {
      throw new BadRequestException(
        'Não é possível alterar o status de uma candidatura encerrada',
      );
    }

    if (status === 'HIRED') {
      const contractToken = randomUUID();
      const frontendUrl =
        this.configService.get('FRONTEND_URL') || 'http://localhost:3000';

      await this.prisma.application.update({
        where: { id },
        data: { status: 'HIRED' as any, contractToken },
      });

      const candidateName =
        application.user.profile?.fullName || application.user.email;

      await this.mailService.sendContractOffer({
        email: application.user.email,
        candidateName,
        positionTitle: application.position.title,
        employmentType: application.position.employmentType,
        location: application.position.location,
        salaryMin: String(application.position.salaryMin),
        salaryMax: String(application.position.salaryMax),
        currency: application.position.currency,
        acceptUrl: `${frontendUrl}/contract/${contractToken}?action=accept`,
        rejectUrl: `${frontendUrl}/contract/${contractToken}?action=reject`,
      });

      return { id, status: 'HIRED', updatedAt: new Date().toISOString() };
    }

    const updated = await this.prisma.application.update({
      where: { id },
      data: { status: status as any },
    });

    await this.mailService.sendApplicationStatusUpdated(
      application.user.email,
      application.position.title,
      status,
    );

    return {
      id: updated.id,
      status: updated.status,
      updatedAt: updated.updatedAt,
    };
  }

  private buildContractHtml(data: {
    candidateName: string;
    candidateEmail: string;
    positionTitle: string;
    employmentType: string;
    location: string;
    salaryMin: string;
    salaryMax: string;
    currency: string;
    date: string;
  }) {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><title>Contrato de Trabalho</title>
<style>
  body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;padding:20px;color:#333;line-height:1.6}
  h1{color:#0296D8;border-bottom:2px solid #0296D8;padding-bottom:10px}
  .field{font-weight:bold}
  .signature{margin-top:60px;display:flex;justify-content:space-between}
  .signature div{text-align:center;width:45%}
  .signature div .line{border-top:1px solid #333;padding-top:8px;margin-top:40px}
</style>
</head>
<body>
  <h1>Contrato de Trabalho — Hireme</h1>
  <p>Firmado em <span class="field">${data.date}</span>, entre a empresa <span class="field">Hireme</span> e o(a) candidato(a) abaixo identificado(a).</p>
  <h2>Dados do Contratado</h2>
  <ul>
    <li><span class="field">Nome:</span> ${data.candidateName}</li>
    <li><span class="field">E-mail:</span> ${data.candidateEmail}</li>
  </ul>
  <h2>Dados da Vaga</h2>
  <ul>
    <li><span class="field">Cargo:</span> ${data.positionTitle}</li>
    <li><span class="field">Regime:</span> ${data.employmentType}</li>
    <li><span class="field">Localização:</span> ${data.location}</li>
    <li><span class="field">Faixa salarial:</span> ${data.currency} ${data.salaryMin} – ${data.salaryMax}</li>
  </ul>
  <h2>Cláusulas</h2>
  <p>1. O presente contrato tem por objeto a prestação de serviços profissionais na função acima descrita.</p>
  <p>2. O contratado declara estar ciente das políticas internas da empresa.</p>
  <p>3. Este documento é uma simulação para fins de MVP e não possui validade jurídica.</p>
  <div class="signature">
    <div><div class="line">Empresa — Hireme</div></div>
    <div><div class="line">${data.candidateName}</div></div>
  </div>
</body>
</html>`;
  }

  private async generateHiringDocs(application: {
    id: string;
    user: { email: string; profile?: { fullName?: string | null; resumeUrl?: string | null } | null };
    position: { title: string; employmentType: string; location: string; salaryMin: any; salaryMax: any; currency: string };
  }) {
    const token = this.configService.getOrThrow('BLOB_READ_WRITE_TOKEN');
    const candidateName =
      application.user.profile?.fullName || application.user.email;
    const resumeUrl = application.user.profile?.resumeUrl;

    const contractHtml = this.buildContractHtml({
      candidateName,
      candidateEmail: application.user.email,
      positionTitle: application.position.title,
      employmentType: application.position.employmentType,
      location: application.position.location,
      salaryMin: String(application.position.salaryMin),
      salaryMax: String(application.position.salaryMax),
      currency: application.position.currency,
      date: new Date().toLocaleDateString('pt-BR'),
    });

    const contractBuffer = Buffer.from(contractHtml, 'utf-8');

    const [recruiterContract, adminContract] = await Promise.all([
      put(`recruiter-docs/${application.id}/contrato.html`, contractBuffer, {
        access: 'public',
        contentType: 'text/html',
        token,
      }),
      put(`admin-docs/${application.id}/contrato.html`, contractBuffer, {
        access: 'public',
        contentType: 'text/html',
        token,
      }),
    ]);

    let recruiterResumeUrl: string | null = null;
    let adminResumeUrl: string | null = null;

    if (resumeUrl) {
      const resumeResponse = await fetch(resumeUrl);
      if (resumeResponse.ok) {
        const resumeBuffer = Buffer.from(await resumeResponse.arrayBuffer());
        const [recruiterResume, adminResume] = await Promise.all([
          put(`recruiter-docs/${application.id}/curriculo.pdf`, resumeBuffer, {
            access: 'public',
            contentType: 'application/pdf',
            token,
          }),
          put(`admin-docs/${application.id}/curriculo.pdf`, resumeBuffer, {
            access: 'public',
            contentType: 'application/pdf',
            token,
          }),
        ]);
        recruiterResumeUrl = recruiterResume.url;
        adminResumeUrl = adminResume.url;
      }
    }

    return {
      recruiterContractUrl: recruiterContract.url,
      recruiterResumeUrl,
      adminContractUrl: adminContract.url,
      adminResumeUrl,
    };
  }

  async withdraw(id: string, userId: string) {
    const application = await this.prisma.application.findUnique({
      where: { id },
    });

    if (!application || application.userId !== userId) {
      throw new NotFoundException('Candidatura não encontrada');
    }

    const updated = await this.prisma.application.update({
      where: { id },
      data: { status: 'WITHDRAWN' },
    });

    return {
      id: updated.id,
      status: updated.status,
      updatedAt: updated.updatedAt,
    };
  }

  async findDocuments() {
    return this.prisma.application.findMany({
      where: {
        OR: [
          { recruiterContractUrl: { not: null } },
          { recruiterResumeUrl: { not: null } },
        ],
      },
      select: {
        id: true,
        status: true,
        contractSignedAt: true,
        recruiterContractUrl: true,
        recruiterResumeUrl: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            email: true,
            profile: { select: { fullName: true } },
          },
        },
        position: {
          select: { id: true, title: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findHired() {
    return this.prisma.application.findMany({
      where: { status: 'HIRED' },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        adminContractUrl: true,
        adminResumeUrl: true,
        user: {
          select: {
            id: true,
            email: true,
            profile: { select: { fullName: true } },
          },
        },
        position: {
          select: { id: true, title: true, employmentType: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findByContractToken(token: string, userId?: string) {
    const application = await this.prisma.application.findUnique({
      where: { contractToken: token },
      include: {
        user: { include: { profile: true } },
        position: true,
      },
    });
    if (!application) throw new NotFoundException('Contrato não encontrado');
    if (userId && application.userId !== userId) {
      throw new ForbiddenException('Este contrato não pertence a você');
    }
    return application;
  }

  async acceptContract(token: string, userId: string) {
    const application = await this.findByContractToken(token, userId);

    if (application.status !== 'HIRED') {
      throw new BadRequestException('Este contrato não pode mais ser aceito');
    }
    if (application.contractSignedAt) {
      throw new BadRequestException('Contrato já assinado');
    }

    const docs = await this.generateHiringDocs(application);

    await this.prisma.application.update({
      where: { id: application.id },
      data: {
        contractSignedAt: new Date(),
        ...docs,
      },
    });

    const candidateName =
      application.user.profile?.fullName || application.user.email;
    const positionTitle = application.position.title;

    // Notificar candidato
    await this.mailService.sendContractSigned({
      email: application.user.email,
      candidateName,
      positionTitle,
    });

    // Notificar todos os recrutadores
    const recruiters = await this.prisma.user.findMany({
      where: { role: 'RECRUITER', isActive: true },
      select: { email: true },
    });

    await Promise.all(
      recruiters.map((r) =>
        this.mailService.sendContractSigned({
          email: r.email,
          candidateName,
          positionTitle,
        }),
      ),
    );

    return { ok: true, status: 'signed' };
  }

  async rejectContract(token: string, userId: string) {
    const application = await this.findByContractToken(token, userId);

    if (application.status !== 'HIRED') {
      throw new BadRequestException('Este contrato não pode mais ser alterado');
    }
    if (application.contractSignedAt) {
      throw new BadRequestException('Contrato já assinado — não pode desistir');
    }

    await this.prisma.application.update({
      where: { id: application.id },
      data: { status: 'WITHDRAWN' },
    });

    await this.mailService.sendApplicationStatusUpdated(
      application.user.email,
      application.position.title,
      'WITHDRAWN',
    );

    return { ok: true, status: 'withdrawn' };
  }

  async findAll() {
    return this.prisma.application.findMany({
      select: {
        id: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        position: {
          select: {
            id: true,
            title: true,
            employmentType: true,
            location: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
