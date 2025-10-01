'use client';

import React from 'react';
import Link from 'next/link';
import AuthForm from '@/components/AuthForm';
import SocialProviders from '@/components/SocialProviders';

export default function SignInPage() {
  const handleSubmit = (data: { email: string; password: string; name?: string }) => {
    console.log('Sign in data:', data);
    // Authentication logic will be implemented separately
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <h1 className="text-heading-3 text-dark-900">
          Welcome Back
        </h1>
        <p className="text-body text-dark-700">
          Sign in to your account to continue
        </p>
      </div>

      {/* Social Providers */}
      <SocialProviders type="signin" />

      {/* Auth Form */}
      <AuthForm type="signin" onSubmit={handleSubmit} />

      {/* Sign Up Link */}
      <div className="text-center pt-4 border-t border-light-300">
        <p className="text-body text-dark-700">
          Don't have an account?{' '}
          <Link
            href="/sign-up"
            className="text-dark-900 font-medium hover:text-dark-700 underline transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

