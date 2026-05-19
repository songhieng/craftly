import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Creative Cambodia',
  description: 'AI-assisted creative production for Cambodian SMEs.',
  metadataBase: new URL('https://ai-creative-cambodia.local'),
  openGraph: {
    title: 'AI Creative Cambodia',
    description: 'AI-assisted creative production with human review and Khmer-safe handling.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
