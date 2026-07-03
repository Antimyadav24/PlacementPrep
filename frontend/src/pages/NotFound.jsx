import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { Home, AlertCircle } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8"
        >
          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-6xl font-black text-white mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-300 mb-2">Page Not Found</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </motion.div>
        
        <Button variant="primary" onClick={() => navigate('/')}>
          <Home className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
    </PageTransition>
  );
};

export default NotFound;
