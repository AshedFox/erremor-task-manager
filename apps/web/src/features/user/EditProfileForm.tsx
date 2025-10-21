'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@workspace/ui/components/button';
import { Calendar } from '@workspace/ui/components/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form';
import { Input } from '@workspace/ui/components/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@workspace/ui/components/popover';
import { cn } from '@workspace/ui/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, EraserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

import Spinner from '@/components/Spinner';
import { editProfile } from '@/lib/actions/edit-profile';
import { editProfileSchema } from '@/lib/validation/user';
import { UserWithInclude } from '@/types/user';

import AvatarInput from './AvatarInput';

type EditProfileInput = z.infer<typeof editProfileSchema>;

type Props = {
  user: UserWithInclude<'avatar'>;
  onSuccess?: () => void;
};

const EditProfileForm = ({ user, onSuccess }: Props) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      displayName: user.displayName,
      birthDate: user.birthDate ? new Date(user.birthDate) : null,
    },
  });
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async (input: EditProfileInput) => {
      const { data, error } = await editProfile(input);

      if (error) {
        throw error;
      }
      return data;
    },
    onError: (e) => {
      toast.error('Failed to edit profile', {
        description: e.message,
      });
    },
    onSuccess: () => {
      toast.success('Successfully edited profile');
      queryClient.invalidateQueries({
        queryKey: ['current-user'],
      });
      router.refresh();
      onSuccess?.();
    },
  });

  const onSubmit = (input: EditProfileInput) => {
    mutate(input);
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <AvatarInput
          userId={user.id}
          username={user.username}
          url={user.avatar?.url}
        />
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display name</FormLabel>
              <FormControl>
                <Input {...field} autoFocus disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birth date</FormLabel>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto size-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="start">
                  <Calendar
                    size="sm"
                    mode="single"
                    timeZone="UTC"
                    selected={field.value ?? undefined}
                    onSelect={(e) => {
                      field.onChange(e);
                      setCalendarOpen(false);
                    }}
                    captionLayout="dropdown"
                    defaultMonth={
                      new Date(
                        new Date().setFullYear(new Date().getFullYear() - 12)
                      )
                    }
                    disabled={(date) => {
                      const min = new Date('1990-01-01');
                      const max = new Date(
                        new Date().setFullYear(new Date().getFullYear() - 12)
                      );
                      return date < min || date > max;
                    }}
                  />
                  <Button
                    className="w-full"
                    size="sm"
                    variant="outline"
                    onClick={() => form.setValue('birthDate', null)}
                  >
                    <EraserIcon />
                    Reset
                  </Button>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="mt-auto"
          type="submit"
          size="lg"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Spinner />
              Loading...
            </>
          ) : (
            'Save'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default EditProfileForm;
