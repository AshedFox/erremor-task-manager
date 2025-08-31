import { Separator } from '@workspace/ui/components/separator';
import { SidebarTrigger } from '@workspace/ui/components/sidebar';
import React from 'react';

import SearchBar from './SearchBar';

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
      <SearchBar className="max-w-lg flex-1 m-auto" />
    </header>
  );
};

export default Header;
