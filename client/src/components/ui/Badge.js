import React from 'react';

/**
 * Badge — small status pill
 * @param {string}  label   - text to display
 * @param {string}  variant - 'red' | 'green' | 'yellow' | 'blue' | 'purple' | 'gray'
 */
const VARIANTS = {
  red:    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  green:  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  blue:   'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  gray:   'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
};

const Badge = ({ label, variant = 'gray', className = '' }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${VARIANTS[variant]} ${className}`}>
    {label}
  </span>
);

export default Badge;
