import { SharedModule } from '@app/shared';
import { Module } from '@nestjs/common';
import { ApplicationsModule } from './modules/applications/applications.module';
import { AuthModule } from './modules/auth/auth.module';
import { InterviewsModule } from './modules/interviews/interviews.module';
import { PositionsModule } from './modules/positions/positions.module';
import { ProfileModule } from './modules/profile/profile.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [SharedModule, AuthModule, UsersModule, PositionsModule, ApplicationsModule, InterviewsModule, ProfileModule],
})
export class AppModule {}
