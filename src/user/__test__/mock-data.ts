import { UserRole } from '../../enum/user-role';
import { Users } from '../user.entity';

export const createMockData = {
  firstName: 'John',
  lastName: 'Doe',
  age: 30,
  dob: '1990-01-01',
  email: 'john@example.com',
  password: 'password123',
  confirmPassword: 'password123',
  role: UserRole.USER,
  isActive: true,
};

export const usersMockData: Users[] = [
  {
    uuid: '1',
    firstName: 'John',
    lastName: 'Doe',
    age: 30,
    dob: '1990-01-01',
    email: 'john@example.com',
    password: 'password123',
    role: UserRole.USER,
    isActive: true,
  },
  {
    uuid: '2',
    firstName: 'Jane',
    lastName: 'Doe',
    age: 30,
    dob: '1990-01-01',
    email: 'jane@example.com',
    password: 'password123',
    role: UserRole.USER,
    isActive: true,
  },
];

export const updateMockData = {
  firstName: 'Test',
  lastName: 'Update',
  age: 30,
  dob: '1990-01-01',
  email: 'john@example.com',
};
