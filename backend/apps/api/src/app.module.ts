import { SharedModule } from '@app/shared';
import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PositionsModule } from './modules/positions/positions.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [SharedModule, AuthModule, UsersModule, PositionsModule],
})
export class AppModule {}
