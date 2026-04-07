import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MailService, PrismaService } from '@app/shared';

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
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
      include: { user: true, position: true },
    });

    if (!application) {
      throw new NotFoundException('Candidatura não encontrada');
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
