
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Heart, Bell, User, Share2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Settings from './Settings';
import { motion } from 'framer-motion';

interface ChatHeaderProps {
  girlfriendId: string;
  onMenuClick: () => void;
  onSettingsChange: (settings: { textPrompt: string; imagePrompt: string }) => void;
  onNotificationClick: () => void;
  onProfileClick: () => void;
  onShareClick: () => void;
  unreadNotifications?: number;
}

const girlfriendData: Record<string, { name: string; avatar: string }> = {
  aria: { name: 'Aria', avatar: '💖' },
  luna: { name: 'Luna', avatar: '🌙' },
  zara: { name: 'Zara', avatar: '⚡' },
  sage: { name: 'Sage', avatar: '🌿' },
  nova: { name: 'Nova', avatar: '🚀' },
  ruby: { name: 'Ruby', avatar: '💎' }
};

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  girlfriendId, 
  onMenuClick, 
  onSettingsChange,
  onNotificationClick,
  onProfileClick,
  onShareClick,
  unreadNotifications = 0
}) => {
  const girlfriend = girlfriendData[girlfriendId] || { name: 'AI Companion', avatar: '💖' };

  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-black/20 backdrop-blur-xl border-b border-white/10 p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden text-white hover:bg-white/10"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="text-2xl">{girlfriend.avatar}</div>
            <div>
              <h1 className="text-white font-semibold">{girlfriend.name}</h1>
              <div className="flex items-center gap-1 text-green-400 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Online
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onShareClick}
            className="text-white hover:bg-white/10 relative"
          >
            <Share2 className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onNotificationClick}
            className="text-white hover:bg-white/10 relative"
          >
            <Bell className="h-5 w-5" />
            {unreadNotifications > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-pink-500 text-white text-xs flex items-center justify-center">
                {unreadNotifications}
              </Badge>
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onProfileClick}
            className="text-white hover:bg-white/10"
          >
            <User className="h-5 w-5" />
          </Button>
          
          <Settings onSave={onSettingsChange} />
        </div>
      </div>
    </motion.header>
  );
};

export default ChatHeader;
