
import React from 'react';
import { formatCurrency } from '@/utils/formatters';

interface CurrencyDisplayProps {
  value: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({ 
  value, 
  className = '', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg font-semibold',
    xl: 'text-xl font-bold'
  };

  return (
    <span className={`${sizeClasses[size]} ${className}`}>
      {formatCurrency(value)}
    </span>
  );
};
