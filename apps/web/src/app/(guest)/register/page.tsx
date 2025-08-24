import { Metadata } from 'next';
import React from 'react';

import RegisterForm from '@/features/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Register',
};

const Page = () => {
  return (
    <div className="p-4 bg-linear-120 to-primary/15 flex-1 flex items-center justify-center">
      <RegisterForm />
    </div>
  );
};

export default Page;
