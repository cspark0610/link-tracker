import { Module } from '@nestjs/common';
import { LinksModule } from './links/links.module';

@Module({
  imports: [LinksModule],
})
export class AppModule {}
