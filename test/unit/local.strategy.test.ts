import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { LocalStrategy } from '../../src/auth/strategies/local.strategy';
import { UsersService } from '../../src/auth/users/users.service';
import { UserDocument } from '@app/common';

describe('LocalStrategy', () => {
    let localStrategy: LocalStrategy;
    let usersService: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LocalStrategy,
                {
                    provide: UsersService,
                    useValue: {
                        verifyUser: jest.fn(),
                    },
                },
            ],
        }).compile();

        localStrategy = module.get<LocalStrategy>(LocalStrategy);
        usersService = module.get<UsersService>(UsersService);
    });

    describe('validate', () => {
        it('should return a user if validation is successful', async () => {
            const user: UserDocument = { id: '1', email: 'test@example.com' } as unknown as UserDocument;
            jest.spyOn(usersService, 'verifyUser').mockResolvedValue(user);

            const result = await localStrategy.validate('test@example.com', 'password');
            expect(result).toEqual(user);
        });

        it('should throw an UnauthorizedException if validation fails', async () => {
            jest.spyOn(usersService, 'verifyUser').mockRejectedValue(new Error('Invalid credentials'));

            await expect(localStrategy.validate('test@example.com', 'wrongpassword')).rejects.toThrow(UnauthorizedException);
        });
    });
});