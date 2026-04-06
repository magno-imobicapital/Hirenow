import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { CreatePositionDto } from './dto/create-position.dto';
import { PositionsService } from './positions.service';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Roles(UserRole.RECRUITER)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() dto: CreatePositionDto, @Req() req: { user: { id: string } }) {
    return this.positionsService.create(dto, req.user.id);
  }

  @Public()
  @Get()
  findAll() {
    return this.positionsService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.positionsService.findOne(id);
  }
}
