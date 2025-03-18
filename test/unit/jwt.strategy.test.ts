/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../src/auth/users/users.service';
import { JwtStrategy } from '../../src/auth/strategies/jwt.strategy';
import { TokenPayload } from '../../src/auth/interfaces/token-payload.interface';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let configService: ConfigService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-secret'),
          },
        },
        {
          provide: UsersService,
          useValue: {
            getUserById: jest.fn().mockResolvedValue({ _id: 'test-user-id' }),
          },
        },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    configService = module.get<ConfigService>(ConfigService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  describe('validate', () => {
    it('should validate and return the user based on userId', async () => {
      const payload: TokenPayload = { userId: 'test-user-id' };
      const user = await jwtStrategy.validate(payload);
      expect(usersService.getUserById).toHaveBeenCalledWith({ _id: 'test-user-id' });
      expect(user).toEqual({ _id: 'test-user-id' });
    });
  });

  describe('jwtFromRequest', () => {
    it('should extract JWT from request cookies', () => {
      const request = {
        cookies: {
          Authentication: 'test-jwt-token',
        },
      };
      const jwtFromRequest = (jwtStrategy as any)._jwtFromRequest.bind(jwtStrategy);
      expect(jwtFromRequest(request)).toBe('test-jwt-token');
    });

    it('should return null if no JWT is found in request cookies', () => {
      const request = {
        cookies: null,
      };
      const jwtFromRequest = (jwtStrategy as any)._jwtFromRequest.bind(jwtStrategy);
      expect(jwtFromRequest(request)).toBeUndefined();
    });
  });
});
