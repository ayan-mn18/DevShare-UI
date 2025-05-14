import React, { ReactNode } from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  onClick?: () => void;
  rightContent?: ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  footer,
  className = '',
  onClick,
  rightContent
}) => {
  return (
    <div
      className={`bg-[#192734] rounded-xl shadow-md overflow-hidden border border-[#2C3640] ${className} ${onClick ? 'cursor-pointer transition-transform hover:translate-y-[-2px]' : ''}`}
      onClick={onClick}
    >
      {(title || subtitle || rightContent) && (
        <div className="px-6 py-4 border-b border-[#2C3640] flex justify-between items-center">
          <div>
            {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
            {subtitle && <p className="text-sm text-[#8899A6] mt-1">{subtitle}</p>}
          </div>
          {rightContent && (
            <div className="flex items-center ml-4">
              {rightContent}
            </div>
          )}
        </div>
      )}

      <div className="px-6 py-4">
        {children}
      </div>

      {footer && (
        <div className="px-6 py-3 bg-[#1C2732] border-t border-[#2C3640]">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;