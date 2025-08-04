
import type { Metadata } from 'next';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { AuthProvider } from '@/context/auth-context';
import { SettingsProvider } from '@/hooks/use-settings.tsx';

export const metadata: Metadata = {
  title: 'Onearn Platform',
  description: 'Earn income by completing tasks.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('min-h-screen bg-background font-body antialiased')}>
        <SettingsProvider>
          <AuthProvider>
              {children}
          </AuthProvider>
        </SettingsProvider>
        <Toaster />
      </body>
    </html>
  );
}
