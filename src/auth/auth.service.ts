import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { error } from 'console';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    // Check if user exists
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      // customize error response
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Email is already taken',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
    await this.userService.createUser(createUserDto);
    return {
      success: true,
      message: 'Registered Succesfully',
    };
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<{
    uuid: string;
    firstName: string;
    lastName: string;
    age: number;
    dob: string;
    email: string;
  }> {
    const user = await this.userService.findByEmail(email);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async signin(
    email: string,
    password: string,
  ): Promise<{
    success: boolean;
    access_token: string;
    data: {
      userId: string;
      firstName: string;
      lastName: string;
      age: number;
      dob: string;
      email: string;
    };
  }> {
    const user = await this.validateUser(email, password);
    if (user) {
      const payload = {
        userId: user.uuid,
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
        dob: user.dob,
        email: user.email,
      };
      return {
        success: true,
        access_token: this.jwtService.sign({
          username: user.email,
          sub: user.uuid,
        }),
        data: payload,
      };
    }
    // customize error response
    throw new HttpException(
      {
        status: HttpStatus.FORBIDDEN,
        error: 'Invalid credentials',
      },
      HttpStatus.FORBIDDEN,
      {
        cause: error,
      },
    );
  }
}
