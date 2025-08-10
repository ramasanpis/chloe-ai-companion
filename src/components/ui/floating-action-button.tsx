import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface FloatingActionButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary';
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  icon,
  className,
  variant = 'primary'
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Button
        onClick={onClick}
        className={cn(
          "h-14 w-14 rounded-full shadow-lg",
          variant === 'primary' 
            ? "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700" 
            : "bg-white/20 backdrop-blur-sm hover:bg-white/30",
          className
        )}
        size="icon"
      >
        {icon}
      </Button>
    </motion.div>
  );
};