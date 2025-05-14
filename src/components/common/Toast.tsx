import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    // Auto-close after 5 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={18} className="text-[#17BF63]" />;
      case 'error':
        return <XCircle size={18} className="text-[#E0245E]" />;
      case 'info':
      default:
        return <Info size={18} className="text-[#1DA1F2]" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-[#17BF63]/10 border-[#17BF63]';
      case 'error':
        return 'bg-[#E0245E]/10 border-[#E0245E]';
      case 'info':
      default:
        return 'bg-[#1DA1F2]/10 border-[#1DA1F2]';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <div className={`p-4 rounded-md shadow-lg border ${getBackgroundColor()} animate-slideIn`}>
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3">
            {getIcon()}
          </div>
          <div className="flex-1">
            <p className="text-sm text-white">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-3 flex-shrink-0 text-white hover:text-gray-300"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;