import { UserRole } from '../../enum/user-role';

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

export const updateMockData = {
  firstName: 'John',
  lastName: 'Doe',
  age: 30,
  dob: '1990-01-01',
  email: 'john@example.com',
};
