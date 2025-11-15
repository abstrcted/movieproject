import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Group2 App - Movie & TV Show Database',
  description: 'Browse movies and TV shows',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}