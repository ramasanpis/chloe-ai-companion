
import React from 'react';
import { Button } from '@/components/ui/button';
import { Lock, Image as ImageIcon } from 'lucide-react';

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
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onImageUnlock }) => {
  const isUser = message.is_user;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
        isUser 
          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white' 
          : 'bg-white/10 backdrop-blur-lg text-white border border-white/20'
      }`}>
        <p className="text-sm">{message.message}</p>
        
        {message.has_image && (
          <div className="mt-2">
            {message.image_unlocked && message.image_url ? (
              <img 
                src={message.image_url} 
                alt="Unlocked content"
                className="w-full h-48 object-cover rounded-lg"
              />
            ) : (
              <div className="relative w-full h-48 bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-lg flex items-center justify-center border border-white/20">
                <div className="absolute inset-0 bg-black/50 rounded-lg backdrop-blur-sm flex flex-col items-center justify-center">
                  <Lock className="h-8 w-8 text-white mb-2" />
                  <p className="text-white text-sm mb-3 text-center">Image locked</p>
                  <Button
                    onClick={onImageUnlock}
                    size="sm"
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
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
    </div>
  );
};

export default MessageBubble;
