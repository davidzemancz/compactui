import React from 'react';
import { IconProps } from './index';

export const CheckboxIcon: React.FC<IconProps> = ({ className = "h-4 w-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="16" height="16" rx="2" />
    <path d="M9 11l3 3l6-6" />
  </svg>
);
