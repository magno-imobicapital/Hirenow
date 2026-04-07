import { PrismaService } from '@app/shared';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInterviewDto } from './dto/create-interview.dto';

@Injectable()
export class InterviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(applicationId: string, dto: CreateInterviewDto) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      throw new NotFoundException('Candidatura não encontrada');
    }

    const interview = await this.prisma.interview.create({
      data: {
        applicationId,
        title: dto.title,
        meetingUrl: dto.meetingUrl,
        scheduledAt: new Date(dto.scheduledAt),
      },
    });

    return {
      id: interview.id,
      title: interview.title,
      meetingUrl: interview.meetingUrl,
      scheduledAt: interview.scheduledAt,
      applicationId: interview.applicationId,
      createdAt: interview.createdAt,
    };
  }

  async findByApplication(applicationId: string) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      throw new NotFoundException('Candidatura não encontrada');
    }

    return this.prisma.interview.findMany({
      where: { applicationId },
      select: {
        id: true,
        title: true,
        meetingUrl: true,
        scheduledAt: true,
        createdAt: true,
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.interview.findMany({
      where: { application: { userId } },
      select: {
        id: true,
        title: true,
        meetingUrl: true,
        scheduledAt: true,
        application: {
          select: {
            id: true,
            position: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }
}
