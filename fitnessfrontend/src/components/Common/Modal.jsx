import React from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, title, children, type = 'info' }) => {
  if (!isOpen) return null;

  const bgColor = {
    info: 'bg-blue-100 border-blue-200 text-blue-700',
    success: 'bg-green-100 border-green-200 text-green-700',
    error: 'bg-red-100 border-red-200 text-red-700',
    warning: 'bg-yellow-100 border-yellow-200 text-yellow-700'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className={`relative max-w-md w-full rounded-xl shadow-xl ${bgColor[type]} border p-6`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes />
        </button>
        
        {title && (
          <h3 className="text-xl font-bold mb-4">
            {title}
          </h3>
        )}
        
        <div className="text-sm">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default Modal;