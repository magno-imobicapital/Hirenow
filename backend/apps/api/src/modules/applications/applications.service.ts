import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@app/shared';

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

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

    const application = await this.prisma.application.create({
      data: { userId, positionId },
    });

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
