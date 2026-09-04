import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NexaIoT Platform',
  description: 'Professional IoT monitoring dashboard for MQTT and EMQX'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
