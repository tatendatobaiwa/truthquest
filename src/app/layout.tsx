import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import './globals.css';

export const metadata: Metadata = {
  title: 'TruthQuest - Fight Fake News, Win Real Knowledge',
  description: 'Test your skills against misinformation, fake news, and digital deception in this high-energy quiz battle!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <footer className="bg-black text-white text-center py-8 mt-12">
          <h4 className="text-2xl font-bold">POWERED BY CRITICAL THINKING</h4>
          <p>Building media literacy one question at a time</p>
        </footer>
      </body>
    </html>
  );
}