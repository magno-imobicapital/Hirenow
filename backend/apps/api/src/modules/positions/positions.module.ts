import { Module } from '@nestjs/common';
import { AiProvider } from './ai-provider';
import { AiRankingService } from './ai-ranking.service';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';

@Module({
  controllers: [PositionsController],
  providers: [PositionsService, AiRankingService, AiProvider],
})
export class PositionsModule {}
