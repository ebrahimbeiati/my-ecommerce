'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function CollapsibleSection({ 
  title, 
  children, 
  defaultOpen = false 
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleOpen();
    }
  };

  return (
    <div className="border-b border-light-300">
      <button
        onClick={toggleOpen}
        onKeyDown={handleKeyDown}
        className="w-full flex items-center justify-between py-5 text-left focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-inset rounded"
        aria-expanded={isOpen}
      >
        <h3 className="text-body-medium text-dark-900 font-medium">
          {title}
        </h3>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-dark-900 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-dark-900 flex-shrink-0" />
        )}
      </button>
      
      {isOpen && (
        <div className="pb-5 text-body text-dark-700 animate-fadeIn">
          {children}
        </div>
      )}
    </div>
  );
}
