import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-light-100 flex flex-col">
      {/* Header with Logo */}
      <header className="w-full py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <Link href="/" className="flex justify-center">
            <Image 
              src="/logo.svg" 
              alt="Nike Logo" 
              width={60} 
              height={60}
              className="hover:opacity-80 transition-opacity"
            />
          </Link>
        </div>
      </header>

      {/* Main Auth Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 px-4 sm:px-6 lg:px-8 border-t border-light-300">
        <div className="max-w-md mx-auto text-center">
          <p className="text-caption text-dark-700">
            © 2025 Nike Store. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

