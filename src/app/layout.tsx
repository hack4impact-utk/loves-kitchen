import theme from '@/types/colors';
import './globals.css';
import { UserProvider } from '@auth0/nextjs-auth0/client';

export const metadata = {
  title: 'The Love Kitchen',
  description: 'A volunteer manager for the Love Kitchen.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`bg-[${theme.offWhite}]`}>
      <UserProvider>
        <body>{children}</body>
      </UserProvider>
    </html>
  );
}
