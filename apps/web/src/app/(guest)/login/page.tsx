import { Metadata } from 'next';
import React from 'react';

import LoginForm from '@/features/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Login',
};

const Page = () => {
  return (
    <div className="p-4 bg-linear-120 to-primary/15 flex-1 flex items-center justify-center">
      <LoginForm />
    </div>
  );
};

export default Page;
