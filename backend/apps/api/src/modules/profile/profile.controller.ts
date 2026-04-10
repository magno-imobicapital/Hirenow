import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserRole } from '@prisma/generated';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';

@ApiTags('Profile')
@ApiBearerAuth()
@Roles(UserRole.CANDIDATE)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() dto: CreateProfileDto, @Req() req: { user: { id: string } }) {
    return this.profileService.create(dto, req.user.id);
  }

  @Get()
  findMine(@Req() req: { user: { id: string } }) {
    return this.profileService.findMine(req.user.id);
  }

  @Patch()
  update(@Body() dto: UpdateProfileDto, @Req() req: { user: { id: string } }) {
    return this.profileService.update(dto, req.user.id);
  }

  @Post('resume')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }),
  )
  uploadResume(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: { user: { id: string } },
  ) {
    return this.profileService.uploadResume(file, req.user.id);
  }
}
