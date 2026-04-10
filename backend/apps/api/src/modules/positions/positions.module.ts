import { Module } from '@nestjs/common';
import { AiRankingService } from './ai-ranking.service';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';

@Module({
  controllers: [PositionsController],
  providers: [PositionsService, AiRankingService],
})
export class PositionsModule {}
