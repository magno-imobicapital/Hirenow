import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  HttpStatus,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { UserRole } from '@prisma/generated';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { CreatePositionDto } from './dto/create-position.dto';
import { ListPositionsQuery } from './dto/list-positions.query';
import { ManagePositionsQuery } from './dto/manage-positions.query';
import { UpdatePositionDto } from './dto/update-position.dto';
import { UpdatePositionStatusDto } from './dto/update-position-status.dto';
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
  findAll(@Query() query: ListPositionsQuery) {
    return this.positionsService.findAll(
      query.page,
      query.limit,
      query.search,
      query.employmentType,
    );
  }

  @Roles(UserRole.RECRUITER)
  @Get('stats')
  getStats(
    @Query('mine') mine: string | undefined,
    @Req() req: { user: { id: string } },
  ) {
    return this.positionsService.getStats(req.user.id, mine === 'true');
  }

  @Roles(UserRole.RECRUITER)
  @Get('manage')
  findAllForManagement(
    @Query() query: ManagePositionsQuery,
    @Req() req: { user: { id: string } },
  ) {
    return this.positionsService.findAllForManagement(query, req.user.id);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.positionsService.findOne(id);
  }

  @Roles(UserRole.RECRUITER)
  @Get(':id/applications')
  findApplications(@Param('id', ParseUUIDPipe) id: string) {
    return this.positionsService.findApplicationsByPosition(id);
  }

  @Roles(UserRole.RECRUITER)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePositionDto,
  ) {
    return this.positionsService.update(id, dto);
  }

  @Roles(UserRole.RECRUITER)
  @Delete(':id')
  archive(@Param('id', ParseUUIDPipe) id: string) {
    return this.positionsService.archive(id);
  }

  @Roles(UserRole.RECRUITER)
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePositionStatusDto,
  ) {
    return this.positionsService.updateStatus(id, dto);
  }
}
