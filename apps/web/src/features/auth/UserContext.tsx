'use client';

import { useQuery } from '@tanstack/react-query';
import { createContext, ReactNode, useContext } from 'react';

import { User } from '@/types/user';

type UserContextValue = {
  user: User | null;
  isLoading: boolean;
  refetchUser: () => Promise<void>;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

type Props = { children: ReactNode; initialUser: User };

export function UserProvider({ children, initialUser }: Props) {
  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery<User>({
    queryKey: ['current-user'],
    queryFn: async () => {
      const res = await fetch('/api/proxy/users/me', {
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error('Failed to get user!');
      }
      return res.json();
    },
    initialData: initialUser ?? undefined,
    staleTime: 60000 * 10,
  });

  async function refetchUser() {
    await refetch();
  }

  return (
    <UserContext value={{ user: user ?? null, isLoading, refetchUser }}>
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
