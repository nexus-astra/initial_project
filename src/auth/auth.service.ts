import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { error } from 'console';
import { CreateUserDto, UserSchema } from '../user/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    // checking if all data is present in the payload
    const result = UserSchema.safeParse(createUserDto);
    if (!result.success) {
      throw new BadRequestException(result.error.errors);
    }
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
    id: string;
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
    access_token: string;
    userData: {
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
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
        dob: user.dob,
        email: user.email,
      };
      return {
        access_token: this.jwtService.sign({
          username: user.email,
          sub: user.id,
        }),
        userData: payload,
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
