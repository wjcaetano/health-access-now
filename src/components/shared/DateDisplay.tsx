
import React from 'react';
import { formatDate } from '@/utils/formatters';

interface DateDisplayProps {
  date: string | Date;
  format?: 'short' | 'long' | 'datetime';
  className?: string;
}

export const DateDisplay: React.FC<DateDisplayProps> = ({ 
  date, 
  format = 'short', 
  className = '' 
}) => {
  return (
    <span className={className}>
      {formatDate(date)}
    </span>
  );
};
