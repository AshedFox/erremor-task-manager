'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@workspace/ui/components/sidebar';
import Link from 'next/link';
import React from 'react';

import { apiFetch } from '@/lib/api-fetch.client';
import { SearchResult } from '@/types/common';
import { Project } from '@/types/project';

type Props = {
  userId: string;
};

const RecentProjectsSidebarMenu = ({ userId }: Props) => {
  const { data } = useSuspenseQuery({
    queryKey: ['projects', 'recent', userId],
    queryFn: async () =>
      apiFetch<SearchResult<Project>>('/projects/recent?limit=5'),
  });

  return (
    <SidebarMenu>
      {data.nodes.length === 0 ? (
        <SidebarMenuItem>
          <SidebarMenuButton disabled>
            <span>No recent projects</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ) : (
        data.nodes.map((project) => (
          <SidebarMenuItem key={project.id}>
            <SidebarMenuButton tooltip={project.name} asChild>
              <Link href={`/projects/${project.id}`}>
                <div
                  className="size-2 rounded-full shrink-0 group-data-[state=collapsed]:hidden"
                  style={{ backgroundColor: project.color }}
                />
                <span>{project.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))
      )}
    </SidebarMenu>
  );
};

export default RecentProjectsSidebarMenu;
