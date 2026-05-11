import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fab City Awards 2026 — Evaluation',
  description: 'Private evaluation platform for the Fab City Awards 2026 jury.',
  robots: 'noindex, nofollow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
