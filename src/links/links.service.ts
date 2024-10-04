import { HttpException, HttpStatus, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { LinksRepository } from './links.repository';
import { CreateMaskUrlDto } from './dto';
import { SecurityUtils } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { CreateUrlResponse } from './dto/create-url.response';

@Injectable({ scope: Scope.REQUEST })
export class LinksService {
  constructor(
    private readonly linksRepository: LinksRepository,
    private readonly configService: ConfigService,
    @Inject(REQUEST) private request: Request
  ) {}
  async createLink({ url }: CreateMaskUrlDto) {
    try {
      const baseUrl = this.getBaseUrl();
      const maskedUrl = SecurityUtils.generateMaskedUrl(baseUrl);
      const password = SecurityUtils.generatePassword();
      const expiresAt = Date.now() + this.configService.get<number>('LINK_EXPIRATION_TIME');

      const response: CreateUrlResponse = {
        target: url,
        link: maskedUrl,
        valid: true,
        password,
        expiresAt,
      };
      const document = {
        ...response,
        redirections: 0,
      };
      await this.linksRepository.create(document);

      return response;
    } catch (error) {
      throw new HttpException('internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async redirect(codeUrl: string, inputPassword: string) {
    const baseUrl = this.getBaseUrl();
    const filterQuery = { link: `${baseUrl}/l/${codeUrl}` };
    const link = await this.linksRepository.findOne(filterQuery);

    if (!link || !link.valid) {
      throw new NotFoundException('Link inexistente o inválido');
    }

    if (!SecurityUtils.verifyHashedPassword(inputPassword)) {
      throw new HttpException('Contraseña Incorrecta', HttpStatus.UNAUTHORIZED);
    }
    if (link.expiresAt < Date.now()) {
      const updateQuery = { valid: false };
      await this.linksRepository.findOneAndUpdate(filterQuery, updateQuery);
      throw new NotFoundException('Link inexistente o inválido');
    }

    const updateRedirectionsQuery = { $inc: { redirections: 1 } };
    await this.linksRepository.findOneAndUpdate(filterQuery, updateRedirectionsQuery);

    return { url: link.target };
  }

  async invalidate(codeUrl: string) {
    const baseUrl = this.getBaseUrl();
    const filterQuery = { link: `${baseUrl}/l/${codeUrl}` };
    const updateQuery = { valid: false };
    const updated = await this.linksRepository.findOneAndUpdate(filterQuery, updateQuery);
    return {
      success: true,
      message: 'Link Invalidado',
      link: updated.link,
    };
  }

  async getStats(codeUrl: string) {
    const baseUrl = this.getBaseUrl();
    const filterQuery = { link: `${baseUrl}/l/${codeUrl}` };
    const link = await this.linksRepository.findOne(filterQuery);

    return { redirections: link.redirections };
  }

  private getBaseUrl() {
    const host = this.request.get('host');
    const protocol = this.request.protocol;
    return `${protocol}://${host}`;
  }
}
