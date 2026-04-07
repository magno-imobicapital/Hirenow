import { PrismaService } from '@app/shared';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { put, del } from '@vercel/blob';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async create(dto: CreateProfileDto, userId: string) {
    const existing = await this.prisma.candidateProfile.findUnique({
      where: { userId },
    });

    if (existing) {
      throw new ConflictException('Perfil já cadastrado');
    }

    return this.prisma.candidateProfile.create({
      data: {
        ...dto,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
        userId,
      },
    });
  }

  async findMine(userId: string) {
    const profile = await this.prisma.candidateProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Perfil não encontrado');
    }

    return profile;
  }

  async update(dto: UpdateProfileDto, userId: string) {
    const profile = await this.prisma.candidateProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Perfil não encontrado');
    }

    return this.prisma.candidateProfile.update({
      where: { userId },
      data: {
        ...dto,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
      },
    });
  }

  async uploadResume(file: Express.Multer.File, userId: string) {
    const profile = await this.prisma.candidateProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Perfil não encontrado');
    }

    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Apenas arquivos PDF são permitidos');
    }

    if (profile.resumeUrl) {
      await del(profile.resumeUrl, {
        token: this.configService.getOrThrow('BLOB_READ_WRITE_TOKEN'),
      });
    }

    const blob = await put(`resumes/${userId}.pdf`, file.buffer, {
      access: 'public',
      contentType: 'application/pdf',
      token: this.configService.getOrThrow('BLOB_READ_WRITE_TOKEN'),
    });

    await this.prisma.candidateProfile.update({
      where: { userId },
      data: { resumeUrl: blob.url },
    });

    return { resumeUrl: blob.url };
  }
}
