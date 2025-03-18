import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../../src/auth/auth.service';
import { Response } from 'express';
import { UserDocument } from '@app/common';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('signed-token'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(3600),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should generate a JWT token and set a cookie', async () => {
      const user = { _id: { toHexString: () => 'user-id' } } as UserDocument;
      const response = {
        cookie: jest.fn(),
      } as unknown as Response;

      const token = await authService.login(user, response);

      expect(jwtService.sign).toHaveBeenCalledWith({ userId: 'user-id' });
      expect(response.cookie).toHaveBeenCalledWith('Authentication', 'signed-token', {
        httpOnly: true,
        expires: expect.any(Date),
      });
      expect(token).toBe('signed-token');
    });
  });

  describe('logout', () => {
    it('should clear the authentication cookie', async () => {
      const response = {
        cookie: jest.fn(),
      } as unknown as Response;

      await authService.logout(response);

      expect(response.cookie).toHaveBeenCalledWith('Authentication', '', {
        httpOnly: true,
        expires: new Date(0),
      });
    });
  });
});
