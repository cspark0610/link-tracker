import { Module } from '@nestjs/common';
// import { LinksModule } from './links/links.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // LinksModule,
    AuthModule,
  ],
})
export class AppModule {}
