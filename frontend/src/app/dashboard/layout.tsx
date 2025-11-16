import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Movie App',
  description: 'Your personal movie dashboard',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
