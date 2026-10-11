import React from 'react';

export const Card = ({ children, className = '', hover = true, ...props }) => {
  return (
    <div 
      className={`bg-white dark:bg-[#0F1424] border border-slate-200/80 dark:border-[#1E2742] rounded-2xl shadow-sm ${
        hover ? 'hover:shadow-lg dark:hover:shadow-indigo-500/5 hover:-translate-y-0.5 transition-all duration-200' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`px-6 py-5 border-b border-slate-100 dark:border-[#1E2742] ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`px-6 py-5 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`px-6 py-4 bg-slate-50/50 dark:bg-[#0D1220] border-t border-slate-100 dark:border-[#1E2742] rounded-b-2xl ${className}`}>
    {children}
  </div>
);
