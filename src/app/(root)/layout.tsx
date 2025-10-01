import React from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function RootGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-light-100">
      <Navbar cartCount={3} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

