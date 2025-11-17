import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register - Movie App',
  description: 'Create a new account to start discovering movies'
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
