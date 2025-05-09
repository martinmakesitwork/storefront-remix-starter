import clsx from 'clsx';
import React from 'react';

type SimpleInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export const SimpleInput = React.forwardRef<HTMLInputElement, SimpleInputProps>(
  ({ label, required, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          required={required}
          {...props}
          className={clsx(
            'block w-full py-2 px-4 shadow-sm border bg-white rounded-md text-base sm:text-sm text-gray-900 border-gray-300 placeholder-gray-500',
            'focus:ring-primary-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:placeholder-gray-400',
            className,
          )}
        />
      </div>
    );
  },
);