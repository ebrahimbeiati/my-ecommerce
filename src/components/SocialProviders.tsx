'use client';

import React from 'react';

interface SocialProvidersProps {
  type: 'signin' | 'signup';
}

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M19.8055 10.2292C19.8055 9.55056 19.7501 8.86667 19.6306 8.19861H10.2V12.0492H15.6014C15.3773 13.2911 14.6571 14.3898 13.6025 15.0875V17.5866H16.825C18.7173 15.8449 19.8055 13.2728 19.8055 10.2292Z"
      fill="#4285F4"
    />
    <path
      d="M10.2 20C12.897 20 15.1714 19.1045 16.8294 17.5866L13.6069 15.0875C12.7078 15.6979 11.5523 16.0433 10.2044 16.0433C7.59474 16.0433 5.38272 14.2834 4.58546 11.917H1.26367V14.4919C2.96127 17.8694 6.41891 20 10.2 20Z"
      fill="#34A853"
    />
    <path
      d="M4.58122 11.917C4.16628 10.6751 4.16628 9.33009 4.58122 8.08819V5.51331H1.26367C-0.154385 8.33778 -0.154385 11.6674 1.26367 14.4919L4.58122 11.917Z"
      fill="#FBBC04"
    />
    <path
      d="M10.2 3.95671C11.6271 3.936 13.0046 4.47008 14.0361 5.45571L16.8907 2.60112C15.0826 0.904579 12.6858 -0.0287217 10.2 0.000114107C6.41891 0.000114107 2.96127 2.13056 1.26367 5.51331L4.58122 8.08819C5.37424 5.71667 7.59051 3.95671 10.2 3.95671Z"
      fill="#EA4335"
    />
  </svg>
);

const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.1449 10.5736C16.1281 8.33313 17.9336 7.24642 18.0235 7.18973C16.9639 5.67187 15.3377 5.4817 14.7666 5.46268C13.3819 5.31563 12.0366 6.32779 11.3313 6.32779C10.6131 6.32779 9.51564 5.47585 8.35039 5.49887C6.82559 5.52289 5.40491 6.43295 4.62969 7.84951C3.04492 10.7236 4.22051 14.9492 5.75156 17.2769C6.51758 18.4221 7.41484 19.7048 8.57809 19.6617C9.71809 19.6147 10.1451 18.8881 11.5201 18.8881C12.8832 18.8881 13.2736 19.6617 14.4643 19.6347C15.6893 19.6147 16.4635 18.4809 17.1904 17.3236C18.0557 16.0068 18.4047 14.7113 18.4194 14.646C18.3904 14.6361 16.1645 13.7688 16.1449 10.5736Z" />
    <path d="M13.7588 3.86286C14.3896 3.09786 14.8254 2.04186 14.7025 0.970703C13.7979 1.01271 12.6766 1.60572 12.0209 2.35688C11.4338 3.02303 10.9098 4.10489 11.0457 5.13605C12.0639 5.21605 13.1061 4.61989 13.7588 3.86286Z" />
  </svg>
);

export default function SocialProviders({ type }: SocialProvidersProps) {
  const handleGoogleAuth = () => {
    console.log(`Google ${type === 'signin' ? 'sign in' : 'sign up'}`);
    // Auth logic will be implemented separately
  };

  const handleAppleAuth = () => {
    console.log(`Apple ${type === 'signin' ? 'sign in' : 'sign up'}`);
    // Auth logic will be implemented separately
  };

  return (
    <div className="space-y-4">
      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-light-400"></div>
        </div>
        <div className="relative flex justify-center text-caption">
          <span className="px-4 bg-light-100 text-dark-500">
            {type === 'signin' ? 'Or sign in with' : 'Or sign up with'}
          </span>
        </div>
      </div>

      {/* Social Provider Buttons */}
      <div className="grid grid-cols-2 gap-4">
        {/* Google Button */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          className="flex items-center justify-center gap-3 px-4 py-3 border border-light-400 rounded-lg text-body-medium text-dark-900 bg-light-100 hover:bg-light-200 active:bg-light-300 transition-colors focus:outline-none focus:ring-2 focus:ring-dark-900/10"
          aria-label={`${type === 'signin' ? 'Sign in' : 'Sign up'} with Google`}
        >
          <GoogleIcon />
          <span className="hidden sm:inline">Google</span>
        </button>

        {/* Apple Button */}
        <button
          type="button"
          onClick={handleAppleAuth}
          className="flex items-center justify-center gap-3 px-4 py-3 border border-light-400 rounded-lg text-body-medium text-dark-900 bg-light-100 hover:bg-light-200 active:bg-light-300 transition-colors focus:outline-none focus:ring-2 focus:ring-dark-900/10"
          aria-label={`${type === 'signin' ? 'Sign in' : 'Sign up'} with Apple`}
        >
          <AppleIcon />
          <span className="hidden sm:inline">Apple</span>
        </button>
      </div>
    </div>
  );
}

