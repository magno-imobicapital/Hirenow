import { PrismaService } from '@app/shared';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { EmploymentType, Prisma } from '@prisma/generated';
import * as ExcelJS from 'exceljs';
import { CreatePositionDto } from './dto/create-position.dto';
import { ManagePositionsQuery } from './dto/manage-positions.query';
import { UpdatePositionDto } from './dto/update-position.dto';
import { UpdatePositionStatusDto } from './dto/update-position-status.dto';

@Injectable()
export class PositionsService {
  private readonly logger = new Logger(PositionsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async exportXlsx() {
    const positions = await this.prisma.position.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        employmentType: true,
        location: true,
        salaryMin: true,
        salaryMax: true,
        currency: true,
        isActive: true,
        createdAt: true,
        createdBy: { select: { email: true } },
        _count: { select: { applications: true } },
        applications: {
          select: { status: true },
        },
      },
    });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Hireme';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('Vagas');
    sheet.columns = [
      { header: 'Título', key: 'title', width: 40 },
      { header: 'Tipo', key: 'employmentType', width: 14 },
      { header: 'Localização', key: 'location', width: 24 },
      { header: 'Salário Min', key: 'salaryMin', width: 14 },
      { header: 'Salário Max', key: 'salaryMax', width: 14 },
      { header: 'Moeda', key: 'currency', width: 8 },
      { header: 'Ativa', key: 'isActive', width: 8 },
      { header: 'Criada em', key: 'createdAt', width: 18 },
      { header: 'Criada por', key: 'createdBy', width: 28 },
      { header: 'Total candidatos', key: 'totalApps', width: 16 },
      { header: 'Pendentes', key: 'pending', width: 12 },
      { header: 'Em análise', key: 'reviewing', width: 12 },
      { header: 'Entrevista', key: 'interview', width: 12 },
      { header: 'Entrev. técnica', key: 'tech', width: 16 },
      { header: 'Contratados', key: 'hired', width: 12 },
      { header: 'Reprovados', key: 'rejected', width: 12 },
      { header: 'Desistentes', key: 'withdrawn', width: 12 },
    ];

    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).alignment = { vertical: 'middle' };

    for (const p of positions) {
      const c = (status: string) =>
        p.applications.filter((a) => a.status === status).length;

      sheet.addRow({
        title: p.title,
        employmentType: p.employmentType,
        location: p.location,
        salaryMin: Number(p.salaryMin),
        salaryMax: Number(p.salaryMax),
        currency: p.currency,
        isActive: p.isActive ? 'Sim' : 'Não',
        createdAt: p.createdAt,
        createdBy: p.createdBy.email,
        totalApps: p._count.applications,
        pending: c('PENDING'),
        reviewing: c('REVIEWING'),
        interview: c('INTERVIEW'),
        tech: c('TECHNICAL_INTERVIEW'),
        hired: c('HIRED'),
        rejected: c('REJECTED'),
        withdrawn: c('WITHDRAWN'),
      });
    }

    return Buffer.from(await workbook.xlsx.writeBuffer());
  }

  async getStats(recruiterId: string, mine?: boolean) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const positionWhere: Prisma.PositionWhereInput = mine
      ? { createdById: recruiterId }
      : {};

    const applicationWhere: Prisma.ApplicationWhereInput = mine
      ? { position: { createdById: recruiterId } }
      : {};

    const [
      openPositions,
      totalPositions,
      totalCandidates,
      newCandidatesThisWeek,
    ] = await this.prisma.$transaction([
      this.prisma.position.count({
        where: { ...positionWhere, isActive: true },
      }),
      this.prisma.position.count({ where: positionWhere }),
      this.prisma.application.count({ where: applicationWhere }),
      this.prisma.application.count({
        where: { ...applicationWhere, createdAt: { gte: sevenDaysAgo } },
      }),
    ]);

    return {
      openPositions,
      totalPositions,
      totalCandidates,
      newCandidatesThisWeek,
    };
  }

  async create(dto: CreatePositionDto, recruiterId: string) {
    const position = await this.prisma.position.create({
      data: {
        ...dto,
        createdById: recruiterId,
      },
    });

    this.logger.log(
      `Vaga criada: positionId=${position.id} por recruiterId=${recruiterId}`,
    );

    return {
      id: position.id,
      title: position.title,
      employmentType: position.employmentType,
      location: position.location,
      isActive: position.isActive,
      createdAt: position.createdAt,
    };
  }

  async findOne(id: string) {
    const position = await this.prisma.position.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        employmentType: true,
        location: true,
        salaryMin: true,
        salaryMax: true,
        currency: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!position) {
      throw new NotFoundException('Posição não encontrada');
    }

    return position;
  }

  async findAll(
    page: number,
    limit: number,
    search?: string,
    employmentType?: EmploymentType,
  ) {
    const where: Prisma.PositionWhereInput = {
      isActive: true,
      ...(employmentType ? { employmentType } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.position.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          employmentType: true,
          location: true,
          salaryMin: true,
          salaryMax: true,
          currency: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.position.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  async findAllForManagement(query: ManagePositionsQuery, recruiterId: string) {
    const { page, limit, search, employmentType, mine, isActive } = query;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const where: Prisma.PositionWhereInput = {
      ...(typeof isActive === 'boolean' ? { isActive } : {}),
      ...(employmentType ? { employmentType } : {}),
      ...(mine ? { createdById: recruiterId } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.position.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          employmentType: true,
          location: true,
          salaryMin: true,
          salaryMax: true,
          currency: true,
          isActive: true,
          createdAt: true,
          createdBy: {
            select: { id: true, email: true },
          },
          _count: {
            select: { applications: true },
          },
          applications: {
            where: { createdAt: { gte: sevenDaysAgo } },
            select: { id: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.position.count({ where }),
    ]);

    const mapped = items.map(({ applications, ...rest }) => ({
      ...rest,
      newApplicationsCount: applications.length,
    }));

    return { items: mapped, total, page, limit };
  }

  async findApplicationsByPosition(positionId: string) {
    const position = await this.prisma.position.findUnique({
      where: { id: positionId },
      select: { id: true, title: true },
    });

    if (!position) {
      throw new NotFoundException('Posição não encontrada');
    }

    const applications = await this.prisma.application.findMany({
      where: { positionId },
      select: {
        id: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        recruiterContractUrl: true,
        recruiterResumeUrl: true,
        user: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                fullName: true,
                about: true,
                mobilePhone: true,
                landlinePhone: true,
                salaryExpectation: true,
                resumeUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const grouped: Record<string, typeof applications> = {};
    for (const app of applications) {
      const key = app.status as string;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(app);
    }

    const nextInterview = await this.prisma.interview.findFirst({
      where: {
        application: { positionId },
        scheduledAt: { gte: new Date() },
      },
      orderBy: { scheduledAt: 'asc' },
      select: {
        id: true,
        title: true,
        scheduledAt: true,
        meetingUrl: true,
        application: {
          select: {
            id: true,
            user: {
              select: {
                email: true,
                profile: { select: { fullName: true } },
              },
            },
          },
        },
      },
    });

    return {
      position,
      total: applications.length,
      groups: grouped,
      nextInterview,
    };
  }

  async update(id: string, dto: UpdatePositionDto) {
    const exists = await this.prisma.position.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!exists) {
      throw new NotFoundException('Posição não encontrada');
    }

    this.logger.log(`Vaga atualizada: positionId=${id}`);

    return this.prisma.position.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        title: true,
        description: true,
        employmentType: true,
        location: true,
        salaryMin: true,
        salaryMax: true,
        currency: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async archive(id: string) {
    const exists = await this.prisma.position.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!exists) {
      throw new NotFoundException('Posição não encontrada');
    }

    await this.prisma.position.update({
      where: { id },
      data: { isActive: false },
    });

    return { id, isActive: false };
  }

  async updateStatus(id: string, dto: UpdatePositionStatusDto) {
    const exists = await this.prisma.position.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!exists) {
      throw new NotFoundException('Posição não encontrada');
    }

    return this.prisma.position.update({
      where: { id },
      data: { isActive: dto.isActive },
      select: {
        id: true,
        isActive: true,
      },
    });
  }
}
