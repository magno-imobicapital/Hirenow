import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { UserRole } from '@prisma/generated';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { ApplicationsService } from './applications.service';
import { UpdateStatusDto } from './dto/update-status.dto';

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

  @Roles(UserRole.RECRUITER)
  @Get('applications/documents')
  findDocuments() {
    return this.applicationsService.findDocuments();
  }

  @Roles(UserRole.ADMIN)
  @Get('applications/hired')
  findHired() {
    return this.applicationsService.findHired();
  }

  @Roles(UserRole.CANDIDATE)
  @Patch('applications/:id/withdraw')
  withdraw(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: { user: { id: string } },
  ) {
    return this.applicationsService.withdraw(id, req.user.id);
  }

  @Roles(UserRole.CANDIDATE)
  @Get('contract/:token')
  viewContract(
    @Param('token') token: string,
    @Req() req: { user: { id: string } },
  ) {
    return this.applicationsService.findByContractToken(token, req.user.id);
  }

  @Roles(UserRole.CANDIDATE)
  @Post('contract/:token/accept')
  acceptContract(
    @Param('token') token: string,
    @Req() req: { user: { id: string } },
  ) {
    return this.applicationsService.acceptContract(token, req.user.id);
  }

  @Roles(UserRole.CANDIDATE)
  @Post('contract/:token/reject')
  rejectContract(
    @Param('token') token: string,
    @Req() req: { user: { id: string } },
  ) {
    return this.applicationsService.rejectContract(token, req.user.id);
  }

  @Roles(UserRole.RECRUITER)
  @Patch('applications/:id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.applicationsService.updateStatus(id, dto.status);
  }
}
