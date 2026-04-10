import { MailService, PrismaService } from '@app/shared';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateInterviewDto } from './dto/create-interview.dto';

@Injectable()
export class InterviewsService {
  private readonly logger = new Logger(InterviewsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async create(applicationId: string, dto: CreateInterviewDto) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { user: true, position: true },
    });

    if (!application) {
      throw new NotFoundException('Candidatura não encontrada');
    }

    const ALLOWED = ['INTERVIEW', 'TECHNICAL_INTERVIEW'];
    if (!ALLOWED.includes(application.status)) {
      throw new BadRequestException(
        'Só é possível agendar entrevista quando o candidato está em etapa de entrevista',
      );
    }

    const interview = await this.prisma.interview.create({
      data: {
        applicationId,
        title: dto.title,
        meetingUrl: dto.meetingUrl,
        scheduledAt: new Date(dto.scheduledAt),
      },
    });

    this.logger.log(
      `Entrevista agendada: interviewId=${interview.id} applicationId=${applicationId} scheduledAt=${interview.scheduledAt.toISOString()}`,
    );

    await this.mailService.sendInterviewScheduled(
      application.user.email,
      application.position.title,
      interview.title,
      interview.scheduledAt.toISOString(),
      interview.meetingUrl ?? undefined,
    );

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
