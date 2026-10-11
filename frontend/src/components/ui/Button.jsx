import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  pill = false, 
  className = '', 
  ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/30",
    secondary: "bg-white dark:bg-[#13192B] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[#1E2742] hover:bg-slate-50 dark:hover:bg-[#1A2238] shadow-sm",
    dark: "bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold shadow-sm",
    white: "bg-white hover:bg-slate-50 text-slate-900 font-semibold shadow-sm",
    outline: "bg-transparent border border-slate-200 dark:border-[#1E2742] hover:bg-slate-100 dark:hover:bg-[#13192B] text-slate-800 dark:text-slate-200",
    danger: "bg-rose-600 hover:bg-rose-500 text-white shadow-sm",
    ghost: "bg-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs font-semibold",
    md: "px-4 py-2 text-sm font-semibold",
    lg: "px-6 py-2.5 text-base font-semibold",
  };

  const rounded = pill ? "rounded-full" : "rounded-xl";

  return (
    <button 
      className={`${baseStyle} ${variants[variant] || variants.primary} ${sizes[size]} ${rounded} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
