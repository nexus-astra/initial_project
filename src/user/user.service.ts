import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './user.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<Users> {
    const { firstName, lastName, age, dob, email, password, role, isActive } =
      createUserDto;
    // Hash password

    let hashedPassword = '';
    try {
      const saltRounds = 10;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      hashedPassword = await bcrypt.hash(password, saltRounds);
    } catch (error) {
      console.error('Error hashing password:', error);
      throw new Error('Password hashing failed'); // Ensure proper error handling
    }

    // Create user instance
    const newUser = this.userRepository.create({
      uuid: uuidv4(),
      firstName,
      lastName,
      age,
      dob,
      email,
      password: hashedPassword,
      role: role ? role : 'user',
      isActive: isActive ? isActive : true,
    });

    // Save to database
    return this.userRepository.save(newUser);
  }

  async findAllUser(): Promise<{
    success: boolean;
    data: Users[];
    message: string;
  }> {
    // console.log(this.userRepository);
    const data = await this.userRepository.find({
      where: { role: 'user' },
    });
    return {
      success: true,
      data,
      message: 'Data fetched successfully',
    };
  }

  async findOneUser(id: string): Promise<{
    success: boolean;
    data: Users;
    message: string;
  }> {
    try {
      const userData = await this.userRepository.findOne({
        where: { uuid: id },
      });
      if (!userData) {
        throw new NotFoundException('User not found');
      }
      return {
        success: true,
        data: userData,
        message: 'Data fetched successfully',
      };
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.log(error?.stack);
      throw new NotFoundException('User not found');
    }
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<{
    success: boolean;
    data: Users;
    message: string;
  }> {
    try {
      const userData = await this.userRepository.findOne({
        where: { uuid: id },
      });
      if (!userData) {
        throw new NotFoundException('User not found');
      }

      Object.assign(userData, updateUserDto);
      await this.userRepository.save(userData);
      return {
        success: true,
        data: userData,
        message: 'Data updated successfully',
      };
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.log(error?.stack);
    }
  }

  async removeUser(id: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const userData = await this.userRepository.findOne({
        where: { uuid: id },
      });
      if (!userData) {
        throw new NotFoundException('User not found');
      }
      await this.userRepository.remove(userData);
      return {
        success: true,
        message: 'Data deleted successfully',
      };
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.log(error?.stack);
      throw new NotFoundException('User not found');
    }
  }

  async findByEmail(email: string): Promise<Users | null> {
    return this.userRepository.findOne({ where: { email } });
  }
}
