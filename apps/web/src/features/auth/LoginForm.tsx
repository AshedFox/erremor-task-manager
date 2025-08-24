'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
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
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

import Spinner from '@/components/Spinner';
import { getQueryClient } from '@/lib/query-client';
import { loginSchema } from '@/lib/validation/auth';

type LoginInput = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const queryClient = getQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutate, isPending } = useMutation({
    mutationFn: async (input: LoginInput) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const { errors } = (await res.json()) as { errors: string[] };

        throw new Error(errors.join(', '));
      }
    },
    onError: (error) => {
      toast.error('Login falied!', {
        description: error.message,
      });
    },
    onSuccess: () => {
      toast.success('Login successful!');
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
      router.replace(searchParams.get('from') ?? '/projects');
    },
  });

  const onSubmit = (input: LoginInput) => {
    mutate(input);
  };

  return (
    <Card className="max-w-xl w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Login to Erremor using your email and password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            id="login-form"
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
          </form>
        </Form>
      </CardContent>
      <CardFooter className="space-x-2">
        <Button form="login-form" type="submit" size="lg" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner />
              Loading...
            </>
          ) : (
            'Login'
          )}
        </Button>
        <Button
          className="text-xs font-normal underline text-muted-foreground hover:text-primary"
          variant="link"
          size="sm"
          asChild
        >
          <Link href="/register">Don&apos;t have an account?</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
