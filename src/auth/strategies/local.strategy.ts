import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserDocument } from '@app/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly usersService: UsersService) {
    super({
      usernameField: 'email',
    });
  }

  // This method is called by Passport to validate the user, has to be called validate
  async validate(email: string, password: string): Promise<UserDocument> {
    try {
      return await this.usersService.verifyUser(email, password);
    } catch (e) {
      throw new UnauthorizedException(JSON.stringify(e));
    }
  }
}
