import '@workspace/ui/globals.css';

import { Metadata } from 'next';
import { JetBrains_Mono, Lora, Manrope, Roboto } from 'next/font/google';

import { Providers } from '@/components/Providers';

const fontHeading = Manrope({
  subsets: ['latin'],
  variable: '--font-heading',
});

const fontSans = Roboto({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fontSerif = Lora({
  subsets: ['latin'],
  variable: '--font-serif',
});

const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: {
    default: 'Erremore',
    template: `%s | Erremore`,
  },
  robots: {
    follow: true,
    index: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} ${fontSerif.variable} ${fontHeading.variable} font-sans antialiased min-h-svh flex flex-col`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
