import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersRepository } from '../../src/auth/users/users.repository';
import { UserDocument } from '@app/common';

describe('UsersRepository', () => {
  let usersRepository: UsersRepository;
  let userModel: Model<UserDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: getModelToken(UserDocument.name),
          useValue: Model,
        },
      ],
    }).compile();

    usersRepository = module.get<UsersRepository>(UsersRepository);
    userModel = module.get<Model<UserDocument>>(getModelToken(UserDocument.name));
  });

  it('should be defined', () => {
    expect(usersRepository).toBeDefined();
    expect(userModel).toBeDefined();
  });

  it('should call logger on instantiation', () => {
    const loggerSpy = jest.spyOn(usersRepository['logger'], 'log');
    usersRepository['logger'].log('test');
    expect(loggerSpy).toHaveBeenCalledWith('test');
  });
});
