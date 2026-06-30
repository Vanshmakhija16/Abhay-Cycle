import React from 'react';

/**
 * Loader — full-screen or inline spinner
 * @param {boolean} fullScreen  - centre on full viewport height
 * @param {string}  size        - 'sm' | 'md' | 'lg'
 */
const Loader = ({ fullScreen = false, size = 'md' }) => {
  const sizes = { sm: 'w-6 h-6 border-2', md: 'w-10 h-10 border-4', lg: 'w-16 h-16 border-4' };

  const spinner = (
    <div className={`${sizes[size]} border-red-600 dark:border-orange-500 border-t-transparent rounded-full animate-spin`} />
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F9] dark:bg-[#0F0F1A]">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-12">{spinner}</div>;
};

export default Loader;
