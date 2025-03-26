import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
@Entity()
export class Users {
  @ApiProperty({ example: 1, description: 'Unique user ID' })
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ApiProperty({ example: 'John', description: 'First name of the user' })
  @Column()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  @Column()
  lastName: string;

  @ApiProperty({ example: 18, description: 'Age of the user' })
  @Column()
  age: number;

  @ApiProperty({
    example: '2023-01-01',
    description: 'Date of birth of the user',
  })
  @Column()
  dob: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email address' })
  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  role: string;

  @Column({ default: true })
  isActive: boolean;
}
