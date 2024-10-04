import { Controller, Get, Post, Body, Param, Res, Put, Query } from '@nestjs/common';
import { LinksService } from './links.service';
import { CreateMaskUrlDto } from './dto';
import type { Response } from 'express';

@Controller('/')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}
  @Post('/create')
  async createLink(@Body() dto: CreateMaskUrlDto) {
    return await this.linksService.createLink(dto);
  }

  @Get('/l/:codeUrl')
  async redirect(@Param('codeUrl') codeUrl: string, @Query('password') password: string, @Res() res: Response) {
    const { url } = await this.linksService.redirect(codeUrl, password);
    res.status(302).redirect(url);
  }

  @Put('/l/:codeUrl')
  async invalidateLink(@Param('codeUrl') codeUrl: string, @Res() res: Response) {
    const result = await this.linksService.invalidate(codeUrl);
    res.status(200).send(result);
  }

  @Get('/:codeUrl/stats')
  async getStats(@Param('codeUrl') codeUrl: string, @Res() res: Response) {
    const result = await this.linksService.getStats(codeUrl);
    res.status(200).send(result);
  }
}
