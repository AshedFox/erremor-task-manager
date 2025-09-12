'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@workspace/ui/components/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@workspace/ui/components/command';
import { DateTimePicker } from '@workspace/ui/components/datetime-picker';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@workspace/ui/components/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { cn } from '@workspace/ui/lib/utils';
import { Check, ChevronDown } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

import Spinner from '@/components/Spinner';
import { useDebounce } from '@/hooks/use-debounce';
import { inviteParticipant } from '@/lib/actions/invite-participant';
import { apiFetch } from '@/lib/api-fetch.client';
import { inviteParticipantSchema } from '@/lib/validation/participant';
import { Participant } from '@/types/participant';
import { User } from '@/types/user';

type Props = {
  projectId: string;
  currentParticipant: Participant;
};

type InviteInput = z.infer<typeof inviteParticipantSchema>;

const InviteParticipantForm = ({ projectId, currentParticipant }: Props) => {
  const [selectedUser, setSelectedUser] = useState<User>();
  const form = useForm({
    resolver: zodResolver(inviteParticipantSchema),
  });
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const queryClient = useQueryClient();

  const { data: users } = useQuery({
    queryKey: ['users', debouncedSearch, projectId],
    queryFn: async () =>
      apiFetch<User[]>(
        `/projects/${projectId}/candidates?search=${debouncedSearch}`
      ),
    enabled: !!debouncedSearch && debouncedSearch.length >= 2,
  });
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async (input: InviteInput) => {
      const { data, error } = await inviteParticipant(projectId, input);

      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['project', projectId, 'invitations'],
      });
      queryClient.invalidateQueries({
        queryKey: ['project', projectId, 'participants'],
      });
      toast.success('Successfully invited user');
    },
    onError(e) {
      toast.error('Failed to invite user', { description: e.message });
    },
  });

  const onSubmit = (values: InviteInput) => {
    mutate(values);
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'justify-between',
                        !selectedUser && 'text-muted-foreground'
                      )}
                    >
                      {selectedUser ? selectedUser.username : 'Select user'}
                      <ChevronDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-2">
                  <Command>
                    <CommandInput
                      value={search}
                      onValueChange={setSearch}
                      placeholder="Search username..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No users found.</CommandEmpty>
                      <CommandGroup>
                        {users?.map((user) => (
                          <CommandItem
                            value={user.username}
                            key={user.id}
                            onSelect={() => {
                              if (user.id === field.value) {
                                form.resetField('userId');
                                setSelectedUser(undefined);
                              } else {
                                form.setValue('userId', user.id);
                                setSelectedUser(user);
                              }
                            }}
                          >
                            {user.username}
                            {user.id === field.value && (
                              <Check className={'ml-auto'} />
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="GUEST">guest</SelectItem>
                  <SelectItem value="USER">user</SelectItem>
                  {currentParticipant.role === 'OWNER' && (
                    <SelectItem value="ADMIN">admin</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expiresAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expires At</FormLabel>
              <FormControl>
                <DateTimePicker
                  {...field}
                  hourCycle={24}
                  yearRange={1}
                  disabledDates={(date) => {
                    const min = new Date(new Date().setHours(0, 0, 0, 0));
                    const max = new Date(
                      new Date().setMonth(new Date().getMonth() + 3)
                    );
                    return date < min || date > max;
                  }}
                  granularity="minute"
                  placeholder="Pick expiration datetime"
                />
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
              Loading...
            </>
          ) : (
            'Invite'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default InviteParticipantForm;
