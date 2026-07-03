import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = true, glass = true, ...props }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -5, transition: { duration: 0.2 } } : {}}
      className={`
        ${glass ? 'bg-white/5 backdrop-blur-md border border-white/10' : 'bg-gray-800 border border-gray-700'}
        rounded-2xl p-6 shadow-xl ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
