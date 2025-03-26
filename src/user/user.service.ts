import { Injectable, HttpException } from '@nestjs/common';
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

  async findOneUser(uuid: string): Promise<{
    success: boolean;
    data: Users;
    message: string;
  }> {
    const userData = await this.userRepository.findOne({ where: { uuid } });
    if (!userData) {
      throw new HttpException('User Not Found', 404);
    }
    return {
      success: true,
      data: userData,
      message: 'Data fetched successfully',
    };
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<{
    success: boolean;
    data: Users;
    message: string;
  }> {
    const existingUser = await this.findOneUser(id);
    const userData = this.userRepository.merge(
      existingUser.data,
      updateUserDto,
    );
    await this.userRepository.save(userData);
    return {
      success: true,
      data: userData,
      message: 'Data updated successfully',
    };
  }

  async removeUser(id: string): Promise<{
    success: boolean;
    message: string;
  }> {
    const existingUser = await this.findOneUser(id);
    await this.userRepository.remove(existingUser.data);
    return {
      success: true,
      message: 'Data deleted successfully',
    };
  }

  async findByEmail(email: string): Promise<Users | null> {
    return this.userRepository.findOne({ where: { email } });
  }
}
