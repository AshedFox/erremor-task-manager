'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { apiFetch } from '@/lib/api-fetch.client';

import { useUser } from '../auth/UserContext';

type Props = {
  projectId: string;
};

const ProjectViewLogger = ({ projectId }: Props) => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (projectId: string) =>
      apiFetch(`/projects/${projectId}/view`, {
        method: 'POST',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['projects', 'recent', user.id],
      });
    },
  });

  useEffect(() => {
    mutate(projectId);
  }, [mutate, projectId]);

  return null;
};

export default ProjectViewLogger;
