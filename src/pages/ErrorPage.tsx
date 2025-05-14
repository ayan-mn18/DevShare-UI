import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { Home, AlertTriangle } from 'lucide-react';

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-[#E0245E]/10">
            <AlertTriangle size={56} className="text-[#E0245E]" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">Page Not Found</h1>
        
        <p className="text-[#8899A6] mb-8">
          The page you're looking for doesn't exist or you don't have permission to access it.
        </p>
        
        <Button
          icon={<Home size={18} />}
          onClick={() => navigate('/')}
          className="mx-auto"
        >
          Return Home
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;