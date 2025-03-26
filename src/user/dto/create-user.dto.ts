import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsBoolean,
  IsNumber,
  ValidateIf,
} from 'class-validator';
import { Exclude } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({ example: 'John', description: 'First name of the user' })
  @IsNotEmpty({ message: 'First name is required' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  @IsNotEmpty({ message: 'Last name is required' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 18, description: 'Age of the user' })
  @IsNumber()
  @IsNotEmpty({ message: 'Age is required' })
  age: number;

  @ApiProperty({
    example: '2023-01-01',
    description: 'Date of birth of the user',
  })
  @IsNotEmpty({ message: 'Date of birth is required' })
  @IsString()
  dob: string;

  @ApiProperty({
    example: 'exampl@gmail.com',
    description: 'Email of the user',
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsString()
  email: string;

  @ApiProperty({
    example: 'password',
    description: 'Password of the user',
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @Exclude()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @ApiProperty({
    example: 'password',
    description: 'Confirm password',
    minLength: 6,
  })
  @IsString()
  @ValidateIf(
    (obj: { password: string; confirmPassword: string }) =>
      obj.password === obj.confirmPassword,
  )
  confirmPassword: string;

  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ example: 'user', description: 'Role of the user' })
  @IsString()
  role: 'user' | 'admin' | 'superadmin';
}
