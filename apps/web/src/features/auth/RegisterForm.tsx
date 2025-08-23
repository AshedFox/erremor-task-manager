'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form';
import { Input } from '@workspace/ui/components/input';
import Link from 'next/link';
import React, { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

import Spinner from '@/components/Spinner';
import { register } from '@/lib/actions/register';
import { registerSchema } from '@/lib/validation/auth';

type RegisterInput = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      passwordComparison: '',
    },
  });

  const onSubmit = (input: RegisterInput) => {
    startTransition(async () => {
      const result = await register(input);

      if (result?.errors) {
        toast.error('Registration falied!', {
          description: result.errors.join(', '),
        });
      } else {
        toast.success('Registration successful!', {
          description: 'Please, check your email for confirmation mail.',
        });
      }
    });
  };

  return (
    <Card className="max-w-xl w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Register</CardTitle>
        <CardDescription>
          Register to Erremor using your email and password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            id="register-form"
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      autoFocus
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passwordComparison"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password (repeat)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      autoComplete="off"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="space-x-2">
        <Button
          form="register-form"
          type="submit"
          size="lg"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Spinner /> Loading...
            </>
          ) : (
            'Register'
          )}
        </Button>
        <Button
          className="text-xs font-normal underline text-muted-foreground hover:text-primary"
          variant="link"
          size="sm"
          asChild
        >
          <Link href="/login">Already have an account?</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
