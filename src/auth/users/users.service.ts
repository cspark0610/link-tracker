import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(createUserDto: CreateUserDto) {
    return this.usersRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    if (user && passwordIsValid) {
      //const { password, ...result } = user;
      return user;
    }
    return null;
  }

  async verifyIfEmailExists(email: string) {
    const user = await this.usersRepository.findOne({ email });
    if (user) {
      throw new UnauthorizedException('Cannot register user with this email');
    }
  }

  async getUserById(getUserDto: GetUserDto) {
    return this.usersRepository.findOne(getUserDto);
  }

  async getAllUsers() {
    return this.usersRepository.findAll({});
  }

  async deleteUser(_id: string) {
    return this.usersRepository.findOneAndDelete({ _id });
  }
}
