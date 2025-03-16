import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
// import { Request } from 'express';
import { UsersService } from '../users/users.service';
import { TokenPayload } from '../interfaces/token-payload.interface';
import { Injectable } from '@nestjs/common';

/**
 * se encarga de extraer el jwt token seteado en la cookie Authentication, pasando el mismo JWT_SECRET
 * debe estar decoradas como @Injectable() para poder ser registrada como providers
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService, private readonly usersService: UsersService) {
    super({
      // como el jwt se setea como cookie se debe extraer de la request.cookies.Authentication
      // puedo recibir una http express Request
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request | any) => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate({ userId }: TokenPayload) {
    return this.usersService.getUserById({ _id: userId });
  }
}
