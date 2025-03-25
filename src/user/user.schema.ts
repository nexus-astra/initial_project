import { z } from 'zod';

export const UserSchema = z
  .object({
    id: z.string().uuid().optional(),
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    age: z.number().min(18),
    dob: z.string().date(),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters long')
      .max(100, 'Password must be at most 100 characters long'),
    confirmPassword: z
      .string()
      .min(6, 'Confirm password must be at least 6 characters long')
      .max(100, 'Confirm password must be at most 100 characters long'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
export type CreateUserDto = z.infer<typeof UserSchema>;

export const UpdateUserSchema = z.object({
  id: z.string().uuid().optional(),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  age: z.number().min(18),
  dob: z.string().date(),
  email: z.string().email({ message: 'Invalid email address' }),
});

export type updateUserDto = z.infer<typeof UpdateUserSchema>;
