import { AbstractRepository, LinkDocument } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class LinksRepository extends AbstractRepository<LinkDocument> {
  protected readonly logger = new Logger(LinkDocument.name);

  constructor(
    @InjectModel(LinkDocument.name)
    linkModel: Model<LinkDocument>
  ) {
    super(linkModel);
  }
}
