'use client';

import React from 'react';
import Link from 'next/link';
import AuthForm from '@/components/AuthForm';
import SocialProviders from '@/components/SocialProviders';

export default function SignUpPage() {
  const handleSubmit = (data: { email: string; password: string; name?: string }) => {
    console.log('Sign up data:', data);
    // Authentication logic will be implemented separately
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <h1 className="text-heading-3 text-dark-700">
          Create Your Account
        </h1>
        <p className="text-lead text-dark-900">
          Join Nike to start shopping
        </p>
      </div>

      {/* Social Providers */}
      <SocialProviders type="signup" />

      {/* Auth Form */}
      <AuthForm type="signup" onSubmit={handleSubmit} />

      {/* Sign In Link */}
      <div className="text-center pt-4 border-t border-light-300">
        <p className="text-body text-dark-700">
          Already have an account?{' '}
          <Link
            href="/sign-in"
            className="text-dark-900 font-medium hover:text-dark-700 underline transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

