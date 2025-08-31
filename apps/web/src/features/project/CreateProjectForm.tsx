'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@workspace/ui/components/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Textarea } from '@workspace/ui/components/textarea';
import { cn } from '@workspace/ui/lib/utils';
import { CheckIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

import Spinner from '@/components/Spinner';
import { PROJECT_COLORS } from '@/constants/project';
import { createProject } from '@/lib/actions/create-project';
import { createProjectSchema } from '@/lib/validation/project';

type CreateProjectInput = z.infer<typeof createProjectSchema>;

type Props = {
  onSuccess?: () => void;
};

const CreateProjectForm = ({ onSuccess }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async (input: CreateProjectInput) => {
      const { data, error } = await createProject(input);

      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Successfully created project');
      router.refresh();
      onSuccess?.();
    },
    onError(e) {
      toast.error('Failed to create project', { description: e.message });
    },
  });

  const form = useForm({
    resolver: zodResolver(createProjectSchema),
    defaultValues: { name: '', description: undefined, color: undefined },
  });

  function onSubmit(values: CreateProjectInput) {
    mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} required autoFocus disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea
                  className="max-h-48"
                  {...field}
                  value={field.value ?? ''}
                  rows={3}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <Label>Color</Label>
              </FormLabel>
              <FormControl>
                <div className="flex items-center gap-3">
                  <div className="flex gap-2 flex-wrap p-2">
                    {PROJECT_COLORS.map((c) => {
                      const selected = (field.value ?? '') === c;
                      return (
                        <button
                          key={c}
                          type="button"
                          aria-label={`Select color ${c}`}
                          onClick={() => field.onChange(c)}
                          disabled={isPending}
                          className={cn(
                            'size-6 rounded-md focus:outline-none hover:brightness-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed',
                            selected && 'ring-2 ring-offset-1 ring-gray-800/20'
                          )}
                          style={{ backgroundColor: c }}
                        >
                          {selected && <CheckIcon />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isError && (
          <div className="text-muted-foreground">{error.message}</div>
        )}

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner />
              Creating...
            </>
          ) : (
            'Create'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default CreateProjectForm;
