import { PrismaService } from '@app/shared';
import { Injectable, NotFoundException } from '@nestjs/common';
import type { EmploymentType, Prisma } from '@prisma/generated';
import { CreatePositionDto } from './dto/create-position.dto';
import { ManagePositionsQuery } from './dto/manage-positions.query';
import { UpdatePositionDto } from './dto/update-position.dto';
import { UpdatePositionStatusDto } from './dto/update-position-status.dto';

@Injectable()
export class PositionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [openPositions, totalPositions, totalCandidates, newCandidatesThisWeek] =
      await this.prisma.$transaction([
        this.prisma.position.count({ where: { isActive: true } }),
        this.prisma.position.count(),
        this.prisma.application.count(),
        this.prisma.application.count({
          where: { createdAt: { gte: sevenDaysAgo } },
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
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.position.count({ where }),
    ]);

    return { items, total, page, limit };
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
        user: {
          select: {
            id: true,
            email: true,
            profile: {
              select: { fullName: true },
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

    return {
      position,
      total: applications.length,
      groups: grouped,
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
