import { Input } from '@workspace/ui/components/input';
import { Separator } from '@workspace/ui/components/separator';
import { SidebarTrigger } from '@workspace/ui/components/sidebar';
import { SearchIcon } from 'lucide-react';
import React from 'react';

const Header = () => {
  return (
    <header className="flex items-center gap-2 px-3 py-3">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
      </div>
      <div className="relative max-w-lg flex-1 m-auto">
        <SearchIcon className="absolute left-4 top-1/2 transform -translate-1/2 size-4 text-muted-foreground" />
        <Input className="pl-10" placeholder="Search..." />
      </div>
    </header>
  );
};

export default Header;
