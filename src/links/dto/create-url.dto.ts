import { IsString, IsUrl } from 'class-validator';

export class CreateMaskUrlDto {
  @IsString()
  @IsUrl(undefined, { message: 'Url is not valid.' })
  url: string;
}
