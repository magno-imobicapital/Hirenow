import { SharedModule } from '@app/shared';
import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [SharedModule, AuthModule, UsersModule],
})
export class AppModule {}
