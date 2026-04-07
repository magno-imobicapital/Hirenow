import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { ApplicationsService } from './applications.service';

@Controller()
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Roles(UserRole.CANDIDATE)
  @HttpCode(HttpStatus.CREATED)
  @Post('positions/:positionId/apply')
  apply(
    @Param('positionId', ParseUUIDPipe) positionId: string,
    @Req() req: { user: { id: string } },
  ) {
    return this.applicationsService.apply(positionId, req.user.id);
  }

  @Roles(UserRole.CANDIDATE)
  @Get('applications')
  findMine(@Req() req: { user: { id: string } }) {
    return this.applicationsService.findByUser(req.user.id);
  }

  @Roles(UserRole.RECRUITER)
  @Get('applications/all')
  findAll() {
    return this.applicationsService.findAll();
  }
}
