import React from 'react';

const Input = React.forwardRef(({ icon: Icon, className = '', error, ...props }, ref) => {
  return (
    <div className="w-full">
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          className={`block w-full rounded-xl border bg-white dark:bg-[#0D1220] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all text-sm
            ${Icon ? 'pl-10' : 'pl-3.5'} pr-3.5 py-2.5
            ${error 
              ? 'border-rose-400 dark:border-rose-700 focus:border-rose-500' 
              : 'border-slate-200 dark:border-[#1E2742] focus:border-indigo-500'
            }
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
