import { BarChart3Icon, CalendarIcon, FolderOpenIcon } from 'lucide-react';

export type NavItem = {
  id: string;
  href: string;
  label: string;
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export const SIDEBAR_NAV_ITEMS: NavItem[] = [
  { id: '1', href: '/projects', label: 'Projects', Icon: FolderOpenIcon },
  { id: '2', href: '/calendar', label: 'Calendar', Icon: CalendarIcon },
  { id: '3', href: '/analytics', label: 'Analytics', Icon: BarChart3Icon },
];
