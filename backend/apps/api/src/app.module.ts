import { SharedModule } from '@app/shared';
import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [SharedModule, AuthModule],
})
export class AppModule {}
