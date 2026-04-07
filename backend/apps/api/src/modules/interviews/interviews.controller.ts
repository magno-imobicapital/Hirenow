import {
  Body,
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
import { CreateInterviewDto } from './dto/create-interview.dto';
import { InterviewsService } from './interviews.service';

@Controller()
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Roles(UserRole.RECRUITER)
  @HttpCode(HttpStatus.CREATED)
  @Post('applications/:applicationId/interviews')
  create(
    @Param('applicationId', ParseUUIDPipe) applicationId: string,
    @Body() dto: CreateInterviewDto,
  ) {
    return this.interviewsService.create(applicationId, dto);
  }

  @Roles(UserRole.RECRUITER)
  @Get('applications/:applicationId/interviews')
  findByApplication(
    @Param('applicationId', ParseUUIDPipe) applicationId: string,
  ) {
    return this.interviewsService.findByApplication(applicationId);
  }

  @Roles(UserRole.CANDIDATE)
  @Get('interviews')
  findMine(@Req() req: { user: { id: string } }) {
    return this.interviewsService.findByUser(req.user.id);
  }
}
