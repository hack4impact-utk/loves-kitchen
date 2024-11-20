import './globals.css';
import { UserProvider } from '@auth0/nextjs-auth0/client';

export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-white">
      <UserProvider>
        <body>{children}</body>
      </UserProvider>
    </html>
  );
}
