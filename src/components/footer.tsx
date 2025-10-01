'use client';

import React from 'react';
import Link from 'next/link';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const navigationSections = [
    {
      title: 'Featured',
      links: [
        { name: 'Air Force 1', href: '/air-force-1' },
        { name: 'Huarache', href: '/huarache' },
        { name: 'Air Max 90', href: '/air-max-90' },
        { name: 'Air Max 95', href: '/air-max-95' },
      ],
    },
    {
      title: 'Shoes',
      links: [
        { name: 'All Shoes', href: '/shoes' },
        { name: 'Custom Shoes', href: '/custom-shoes' },
        { name: 'Jordan Shoes', href: '/jordan-shoes' },
        { name: 'Running Shoes', href: '/running-shoes' },
      ],
    },
    {
      title: 'Clothing',
      links: [
        { name: 'All Clothing', href: '/clothing' },
        { name: 'Modest Wear', href: '/modest-wear' },
        { name: 'Hoodies & Pullovers', href: '/hoodies' },
        { name: 'Shirts & Tops', href: '/shirts' },
      ],
    },
    {
      title: "Kids'",
      links: [
        { name: 'Infant & Toddler Shoes', href: '/kids/infant' },
        { name: "Kids' Shoes", href: '/kids/shoes' },
        { name: "Kids' Jordan Shoes", href: '/kids/jordan' },
        { name: "Kids' Basketball Shoes", href: '/kids/basketball' },
      ],
    },
  ];

  const socialLinks = [
    {
      name: 'X (Twitter)',
      href: 'https://twitter.com/nike',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      href: 'https://facebook.com/nike',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/nike',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.281c-.49 0-.875-.385-.875-.875s.385-.875.875-.875.875.385.875.875-.385.875-.875.875zm-1.297 1.297c-1.297 0-2.448.49-3.323 1.297-.807.875-1.297 2.026-1.297 3.323s.49 2.448 1.297 3.323c.875.807 2.026 1.297 3.323 1.297s2.448-.49 3.323-1.297c.807-.875 1.297-2.026 1.297-3.323s-.49-2.448-1.297-3.323c-.875-.807-2.026-1.297-3.323-1.297z" />
        </svg>
      ),
    },
  ];

  const utilityLinks = [
    { name: 'Guides', href: '/guides' },
    { name: 'Terms of Sale', href: '/terms-of-sale' },
    { name: 'Terms of Use', href: '/terms-of-use' },
    { name: 'Nike Privacy Policy', href: '/privacy-policy' },
  ];

  return (
    <footer className={`bg-dark-900 text-light-100 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center mb-4">
              <div className="w-8 h-8 bg-light-100 rounded-full flex items-center justify-center">
                <span className="text-dark-900 font-bold text-lg">N</span>
              </div>
            </Link>
            <p className="text-light-200 text-footnote mb-2">
              © Croatia 2025 Nike, Inc. All Rights Reserved
            </p>
          </div>

          {/* Navigation Sections */}
          {navigationSections.map((section, index) => (
            <div key={section.title} className="lg:col-span-1">
              <h3 className="text-light-100 font-medium text-body-medium mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-light-200 hover:text-light-100 transition-colors duration-200 text-caption"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-dark-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-dark-700 hover:bg-dark-500 rounded-full flex items-center justify-center transition-colors duration-200"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Utility Links */}
            <div className="flex flex-wrap gap-4 sm:gap-6">
              {utilityLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-light-200 hover:text-light-100 transition-colors duration-200 text-footnote"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
