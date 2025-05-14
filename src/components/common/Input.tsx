import React, { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const inputClasses = `
    bg-[#253341] 
    border ${error ? 'border-[#E0245E]' : 'border-[#38444D]'} 
    text-white 
    px-4 
    py-2 
    rounded-md 
    placeholder-[#8899A6] 
    focus:outline-none 
    focus:ring-2 
    focus:ring-[#1DA1F2] 
    focus:border-transparent
    transition-all
    duration-200
    ${icon ? 'pl-10' : ''}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  return (
    <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
      {label && (
        <label className="block text-[#8899A6] text-sm font-medium mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8899A6]">
            {icon}
          </div>
        )}
        
        <input
          className={inputClasses}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-[#E0245E] text-sm">{error}</p>
      )}
    </div>
  );
};

export default Input;