
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Lock, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  message: string;
  is_user: boolean;
  has_image?: boolean;
  image_url?: string;
  image_unlocked?: boolean;
  context_topic?: string;
  created_at: string;
}

interface MessageBubbleProps {
  message: Message;
  onImageUnlock: () => void;
  index?: number;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onImageUnlock, index = 0 }) => {
  const isUser = message.is_user;
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
    console.error('Failed to load image:', message.image_url);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl backdrop-blur-sm ${
        isUser 
          ? 'bg-gradient-to-r from-pink-500/80 to-purple-600/80 text-white border border-white/20' 
          : 'bg-white/15 backdrop-blur-xl text-white border border-white/20'
      }`}>
        <p className="text-sm">{message.message}</p>
        
        {message.has_image && (
          <div className="mt-2">
            {message.image_unlocked && message.image_url && !imageError ? (
              <div className="relative">
                {imageLoading && (
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-lg flex items-center justify-center border border-white/20 backdrop-blur-sm">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                )}
                <img 
                  src={message.image_url} 
                  alt="Generated content"
                  className="w-full h-48 object-cover rounded-lg border border-white/20"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  style={{ display: imageLoading ? 'none' : 'block' }}
                />
                {imageError && (
                  <div className="w-full h-48 bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-lg flex items-center justify-center border border-white/20 backdrop-blur-sm">
                    <div className="text-center">
                      <ImageIcon className="h-8 w-8 text-white/60 mx-auto mb-2" />
                      <p className="text-white/60 text-sm">Image failed to load</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative w-full h-48 bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-lg flex items-center justify-center border border-white/20 backdrop-blur-sm">
                <div className="absolute inset-0 bg-black/50 rounded-lg backdrop-blur-xl flex flex-col items-center justify-center">
                  <Lock className="h-8 w-8 text-white mb-2" />
                  <p className="text-white text-sm mb-3 text-center">Image locked</p>
                  <Button
                    onClick={onImageUnlock}
                    size="sm"
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white backdrop-blur-sm"
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Watch Ad to Unlock
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
        
        <p className="text-xs opacity-70 mt-1">
          {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
