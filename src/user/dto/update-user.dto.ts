import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class UpdateUserDto {
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
}
