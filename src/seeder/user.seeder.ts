import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Users } from '../user/user.entity';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { Seeder } from './main.seeder';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserSeeder implements Seeder {
  constructor(private readonly dataSource: DataSource) {}

  async run(): Promise<void> {
    const userRepository = this.dataSource.getRepository(Users);
    let hashedPassword = '';
    try {
      const saltRounds = 10;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      hashedPassword = await bcrypt.hash('P@ssw0rd', saltRounds);
    } catch (error) {
      console.error('Error hashing password:', error);
      throw new Error('Password hashing failed'); // Ensure proper error handling
    }

    const user = [];
    for (let i = 0; i < 5; i++) {
      user.push({
        id: uuidv4(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        age: faker.number.int({ min: 18, max: 60 }),
        dob: '1990-01-01',
        email: faker.internet.email(),
        password: hashedPassword,
        role: i % 2 === 0 ? 'admin' : 'user',
      });

      await userRepository.save(user);
    }
  }
}
