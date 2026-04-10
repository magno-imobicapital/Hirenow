import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@app/shared';
import type { Prisma, UserRole } from '@prisma/generated';
import * as argon2 from 'argon2';
import { CreateInternalUserDto } from './dto/create-internal-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(role?: UserRole, search?: string) {
    const where: Prisma.UserWhereInput = {
      ...(role ? { role } : {}),
      ...(search
        ? { email: { contains: search, mode: 'insensitive' } }
        : {}),
    };

    return this.prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getStats() {
    const [total, candidates, recruiters, admins] =
      await this.prisma.$transaction([
        this.prisma.user.count(),
        this.prisma.user.count({ where: { role: 'CANDIDATE' } }),
        this.prisma.user.count({ where: { role: 'RECRUITER' } }),
        this.prisma.user.count({ where: { role: 'ADMIN' } }),
      ]);
    return { total, candidates, recruiters, admins };
  }

  async createInternal(dto: CreateInternalUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('E-mail já cadastrado');
    }

    const hashedPassword = await argon2.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: dto.role,
      },
    });

    this.logger.log(
      `Usuário interno criado: userId=${user.id} role=${user.role}`,
    );

    return { id: user.id, email: user.email, role: user.role };
  }

  async deactivate(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user || user.role !== 'RECRUITER') {
      throw new NotFoundException('Recrutador não encontrado');
    }

    await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    this.logger.log(`Usuário desativado: userId=${id}`);
  }

  async activate(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    await this.prisma.user.update({
      where: { id },
      data: { isActive: true },
    });

    this.logger.log(`Usuário ativado: userId=${id}`);

    return { id, isActive: true };
  }
}
