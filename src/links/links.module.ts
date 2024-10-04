import { Module } from '@nestjs/common';
import { LinksController } from './links.controller';
import { LinksService } from './links.service';
import { LoggerModule, ConfigModule, DatabaseModule, LinkDocument, LinkSchema } from '@app/common';
import { LinksRepository } from './links.repository';

@Module({
  imports: [
    LoggerModule,
    ConfigModule,
    DatabaseModule,
    DatabaseModule.forFeature([
      {
        name: LinkDocument.name,
        schema: LinkSchema,
      },
    ]),
  ],
  controllers: [LinksController],
  providers: [LinksService, LinksRepository],
})
export class LinksModule {}
