import { PrismaService } from '@app/shared';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';

@Injectable()
export class PositionsService {
  constructor(private readonly prisma: PrismaService) {}

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

  async findAll() {
    return this.prisma.position.findMany({
      where: { isActive: true },
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
    });
  }
}
