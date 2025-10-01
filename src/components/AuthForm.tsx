'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

interface AuthFormProps {
  type: 'signin' | 'signup';
  onSubmit: (data: FormData) => void;
}

interface FormData {
  email: string;
  password: string;
  name?: string;
}

export default function AuthForm({ type, onSubmit }: AuthFormProps) {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    name: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const isSignUp = type === 'signup';

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (isSignUp && !formData.name) {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        const result = await onSubmit(formData);
        if (result?.success) {
          // Redirect to home page on success
          window.location.href = '/';
        } else if (result?.error) {
          // Show error message
          setErrors({ general: result.error });
        }
      } catch (error) {
        console.error('Form submission error:', error);
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      }
    }
  };

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ ...formData, [field]: e.target.value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field (Sign Up Only) */}
      {isSignUp && (
        <div>
          <label htmlFor="name" className="block text-body-medium text-dark-900 mb-2">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-dark-500" />
            </div>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange('name')}
              placeholder="Enter your full name"
              className={`w-full pl-12 pr-4 py-3 border rounded-lg text-body text-dark-900 placeholder:text-dark-500 focus:outline-none focus:ring-2 transition-colors ${
                errors.name
                  ? 'border-red focus:ring-red/20'
                  : 'border-light-400 focus:ring-dark-900/10'
              }`}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
          </div>
          {errors.name && (
            <p id="name-error" className="mt-2 text-footnote text-red">
              {errors.name}
            </p>
          )}
        </div>
      )}

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-body-medium text-dark-900 mb-2">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-dark-500" />
          </div>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            placeholder="Enter your email"
            className={`w-full pl-12 pr-4 py-3 border rounded-lg text-body text-dark-900 placeholder:text-dark-500 focus:outline-none focus:ring-2 transition-colors ${
              errors.email
                ? 'border-red focus:ring-red/20'
                : 'border-light-400 focus:ring-dark-900/10'
            }`}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
        </div>
        {errors.email && (
          <p id="email-error" className="mt-2 text-footnote text-red">
            {errors.email}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-body-medium text-dark-900 mb-2">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-dark-500" />
          </div>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange('password')}
            placeholder={isSignUp ? 'Create a password (min. 8 characters)' : 'Enter your password'}
            className={`w-full pl-12 pr-12 py-3 border rounded-lg text-body text-dark-900 placeholder:text-dark-500 focus:outline-none focus:ring-2 transition-colors ${
              errors.password
                ? 'border-red focus:ring-red/20'
                : 'border-light-400 focus:ring-dark-900/10'
            }`}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-dark-500 hover:text-dark-900 transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p id="password-error" className="mt-2 text-footnote text-red">
            {errors.password}
          </p>
        )}
      </div>

      {/* Forgot Password Link (Sign In Only) */}
      {!isSignUp && (
        <div className="flex justify-end">
          <a
            href="#"
            className="text-caption text-dark-900 hover:text-dark-700 underline transition-colors"
          >
            Forgot password?
          </a>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-dark-900 text-light-100 py-3 px-4 rounded-lg text-body-medium hover:bg-dark-700 active:bg-dark-900 transition-colors focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2"
      >
        {isSignUp ? 'Create Account' : 'Sign In'}
      </button>

      {/* Terms and Privacy (Sign Up Only) */}
      {isSignUp && (
        <p className="text-footnote text-dark-700 text-center">
          By signing up, you agree to our{' '}
          <a href="#" className="text-dark-900 underline hover:text-dark-700">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-dark-900 underline hover:text-dark-700">
            Privacy Policy
          </a>
        </p>
      )}

      {/* Switch between Sign In and Sign Up */}
      <div className="mt-6 text-center">
        <p className="text-body text-dark-700">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <a
            href={isSignUp ? '/sign-in' : '/sign-up'}
            className="text-dark-900 font-medium hover:text-dark-700 underline transition-colors"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </a>
        </p>
      </div>
    </form>
  );
}

