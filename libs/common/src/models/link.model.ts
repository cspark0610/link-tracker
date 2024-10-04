import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class LinkDocument extends AbstractDocument {
  @Prop({ required: true })
  target: string;

  @Prop({ required: true })
  link: string;

  @Prop({ required: true })
  valid: boolean;

  @Prop({ required: true, default: 0 })
  redirections: number;

  @Prop({ required: true })
  password: string;

  @Prop()
  expiresAt?: number;
}

export const LinkSchema = SchemaFactory.createForClass(LinkDocument);
