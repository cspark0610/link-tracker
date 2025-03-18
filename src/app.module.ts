import { Module } from '@nestjs/common';
// import { LinksModule } from './links/links.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule],
})
export class AppModule {}
