import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../src/auth/users/users.service';
import { UsersRepository } from '../../src/auth/users/users.repository';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserDocument } from '@app/common';

describe('UsersService', () => {
  let service: UsersService;
  let repository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            findAll: jest.fn(),
            findOneAndDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UsersRepository>(UsersRepository);
  });

  it('Service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user with hashed password', async () => {
      const createUserDto = { email: 'test@example.com', password: 'password' };
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve(hashedPassword));
      jest
        .spyOn(repository, 'create')
        .mockResolvedValue({ ...createUserDto, password: hashedPassword } as unknown as UserDocument);

      const result = await service.createUser(createUserDto);

      expect(result).toEqual({ ...createUserDto, password: hashedPassword });
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(repository.create).toHaveBeenCalledWith({ ...createUserDto, password: hashedPassword });
    });
  });

  describe('verifyUser', () => {
    it('should return user if credentials are valid', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const user = { email, password: await bcrypt.hash(password, 10) } as unknown as UserDocument;
      jest.spyOn(repository, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

      const result = await service.verifyUser(email, password);

      expect(result).toEqual(user);
      expect(repository.findOne).toHaveBeenCalledWith({ email });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const user = { email, password: await bcrypt.hash('wrongpassword', 10) } as unknown as UserDocument;
      jest.spyOn(repository, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve());

      await expect(service.verifyUser(email, password)).rejects.toThrow(UnauthorizedException);
      expect(repository.findOne).toHaveBeenCalledWith({ email });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
    });
  });

  describe('verifyIfEmailExists', () => {
    it('should throw UnauthorizedException if email exists', async () => {
      const email = 'test@example.com';
      const user = { email, password: 'password' };
      jest.spyOn(repository, 'findOne').mockResolvedValue(user as unknown as UserDocument);

      await expect(service.verifyIfEmailExists(email)).rejects.toThrow(UnauthorizedException);
      expect(repository.findOne).toHaveBeenCalledWith({ email });
    });

    it('should not throw if email does not exist', async () => {
      const email = 'test@example.com';
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.verifyIfEmailExists(email)).resolves.not.toThrow();
      expect(repository.findOne).toHaveBeenCalledWith({ email });
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      const getUserDto = { _id: '1' };
      const user = { _id: '1', email: 'test@example.com', password: 'password' };
      jest.spyOn(repository, 'findOne').mockResolvedValue(user as unknown as UserDocument);

      const result = await service.getUserById(getUserDto);

      expect(result).toEqual(user);
      expect(repository.findOne).toHaveBeenCalledWith(getUserDto);
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const users = [{ email: 'test@example.com', password: 'password' }];
      jest.spyOn(repository, 'findAll').mockResolvedValue(users as unknown as UserDocument[]);

      const result = await service.getAllUsers();

      expect(result).toEqual(users);
      expect(repository.findAll).toHaveBeenCalledWith({});
    });
  });

  describe('deleteUser', () => {
    it('should delete user by id', async () => {
      const _id = '1';
      const user = { _id, email: 'test@example.com', password: 'password' };
      jest.spyOn(repository, 'findOneAndDelete').mockResolvedValue(user as unknown as UserDocument);

      const result = await service.deleteUser(_id);

      expect(result).toEqual(user);
      expect(repository.findOneAndDelete).toHaveBeenCalledWith({ _id });
    });
  });
});
