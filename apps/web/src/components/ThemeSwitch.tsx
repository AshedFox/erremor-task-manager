'use client';

import { Button } from '@workspace/ui/components/button';
import { ContrastIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';

type Props = {
  className?: string;
};

const ThemeSwitch = ({ className }: Props) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      className={className}
      size="icon"
      variant="ghost"
      onClick={() => {
        if (theme === 'light') {
          setTheme('dark');
        } else if (theme === 'dark') {
          setTheme('system');
        } else {
          setTheme('light');
        }
      }}
    >
      {theme === 'light' ? (
        <SunIcon className="text-yellow-500" />
      ) : theme === 'dark' ? (
        <MoonIcon className="text-indigo-600" />
      ) : (
        <ContrastIcon />
      )}
    </Button>
  );
};

export default ThemeSwitch;
