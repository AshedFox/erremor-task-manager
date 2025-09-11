'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { createContext, ReactNode, useContext } from 'react';

import { apiFetchSafe } from '@/lib/api-fetch.client';
import { User } from '@/types/user';

type UserContextValue = {
  user: User;
  isLoading: boolean;
  refetchUser: () => Promise<void>;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

type Props = { children: ReactNode; initialUser: User };

export function UserProvider({ children, initialUser }: Props) {
  const router = useRouter();
  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery<User>({
    queryKey: ['current-user'],
    queryFn: async () => {
      const result = await apiFetchSafe<User>('/users/me', {
        credentials: 'include',
      });
      if (result.error) {
        router.push('/login');
        throw new Error('Failed to get user!');
      }
      return result.data;
    },
    initialData: initialUser,
    staleTime: 60000 * 10,
  });

  async function refetchUser() {
    await refetch();
  }

  return (
    <UserContext value={{ user, isLoading, refetchUser }}>
      {children}
    </UserContext>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUser must be used within UserProvider');
  }
  return ctx;
}
