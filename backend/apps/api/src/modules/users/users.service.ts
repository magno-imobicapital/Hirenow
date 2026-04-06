import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@app/shared';
import * as argon2 from 'argon2';
import { CreateInternalUserDto } from './dto/create-internal-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

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
  }
}
