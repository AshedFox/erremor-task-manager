import z from 'zod';

export const loginSchema = z.object({
  email: z.email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = loginSchema
  .extend({
    passwordComparison: z.string(),
  })
  .refine(
    ({ password, passwordComparison }) => password === passwordComparison,
    {
      message: 'Passwords must match',
      path: ['passwordComparison'],
    }
  );
