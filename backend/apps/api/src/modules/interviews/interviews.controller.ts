import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { InterviewsService } from './interviews.service';

@Roles(UserRole.RECRUITER)
@Controller('applications/:applicationId/interviews')
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(
    @Param('applicationId', ParseUUIDPipe) applicationId: string,
    @Body() dto: CreateInterviewDto,
  ) {
    return this.interviewsService.create(applicationId, dto);
  }

  @Get()
  findByApplication(
    @Param('applicationId', ParseUUIDPipe) applicationId: string,
  ) {
    return this.interviewsService.findByApplication(applicationId);
  }
}
