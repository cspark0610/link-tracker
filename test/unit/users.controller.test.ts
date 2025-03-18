/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../src/auth/users/users.controller';
import { UsersService } from '../../src/auth/users/users.service';
import { JwtAuthGuard } from '../../src/auth/guards/jwt-auth.guard';
import { CreateUserDto } from '../../src/auth/users/dto/create-user.dto';
import { UserDocument } from '@app/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

describe('UsersController', () => {
    let usersController: UsersController;
    let usersService: UsersService;

    const mockUser = {
        _id: '1',
        email: 'test@test.com',
        password: 'password',
    } as unknown as UserDocument;

    const mockUsersService = {
        createUser: jest.fn().mockResolvedValue(mockUser),
        getAllUsers: jest.fn().mockResolvedValue([mockUser]),
        deleteUser: jest.fn().mockResolvedValue(mockUser),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                { provide: UsersService, useValue: mockUsersService },
                { provide: getModelToken('User'), useValue: Model },
            ],
        })
            .overrideGuard(JwtAuthGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .compile();

        usersController = module.get<UsersController>(UsersController);
        usersService = module.get<UsersService>(UsersService);
    });

    it('UsersController should be defined', () => {
        expect(usersController).toBeDefined();
    });

    describe('createUser', () => {
        it('should create a user', async () => {
            const createUserDto: CreateUserDto = { email: 'test@test.com', password: 'password' };
            expect(await usersController.createUser(createUserDto)).toEqual(mockUser);
            expect(mockUsersService.createUser).toHaveBeenCalledWith(createUserDto);
        });
    });

    describe('getUser', () => {
        it('should return the current user', async () => {
            expect(await usersController.getUser(mockUser)).toEqual(mockUser);
        });
    });

    describe('getAllUsers', () => {
        it('should return an array of users', async () => {
            expect(await usersController.getAllUsers()).toEqual([mockUser]);
            expect(mockUsersService.getAllUsers).toHaveBeenCalled();
        });
    });

    describe('deleteUser', () => {
        it('should delete a user', async () => {
            expect(await usersController.deleteUser('1')).toEqual(mockUser);
            expect(mockUsersService.deleteUser).toHaveBeenCalledWith('1');
        });
    });
});