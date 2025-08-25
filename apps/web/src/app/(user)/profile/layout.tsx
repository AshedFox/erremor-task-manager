import React, { ReactNode } from 'react';

const Layout = ({
  children,
  modal,
}: {
  children: ReactNode;
  modal: ReactNode;
}) => {
  return (
    <>
      {children}
      {modal}
    </>
  );
};

export default Layout;
