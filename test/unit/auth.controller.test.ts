import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';
// import { LocalAuthGuard } from '../../src/auth/guards/local-auth.guard';
// import { JwtAuthGuard } from '../../src/auth/guards/jwt-auth.guard';
import { UserDocument } from '@app/common';
import { Response } from 'express';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    logout: jest.fn(),
  };

  const mockResponse = {
    send: jest.fn(),
  } as unknown as Response;

  const mockUser: UserDocument = {
    _id: 'userId',
    email: 'test@example.com',
    password: 'password',
  } as unknown as UserDocument;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should login a user and send the response', async () => {
      await authController.login(mockUser, mockResponse);
      expect(authService.login).toHaveBeenCalledWith(mockUser, mockResponse);
      expect(mockResponse.send).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('logout', () => {
    it('should logout a user and return a success message', async () => {
      const result = await authController.logout(mockResponse);
      expect(authService.logout).toHaveBeenCalledWith(mockResponse);
      expect(result).toEqual({ message: 'Logout successful' });
    });
  });
});
