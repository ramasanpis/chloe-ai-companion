
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Heart } from 'lucide-react';

interface ChatHeaderProps {
  girlfriendId: string;
  onMenuClick: () => void;
}

const girlfriendData: Record<string, { name: string; avatar: string }> = {
  aria: { name: 'Aria', avatar: '💖' },
  luna: { name: 'Luna', avatar: '🌙' },
  zara: { name: 'Zara', avatar: '⚡' },
  sage: { name: 'Sage', avatar: '🌿' },
  nova: { name: 'Nova', avatar: '🚀' },
  ruby: { name: 'Ruby', avatar: '💎' }
};

const ChatHeader: React.FC<ChatHeaderProps> = ({ girlfriendId, onMenuClick }) => {
  const girlfriend = girlfriendData[girlfriendId] || { name: 'AI Companion', avatar: '💖' };

  return (
    <header className="bg-black/20 backdrop-blur-lg border-b border-white/10 p-4">
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
          <Heart className="h-5 w-5 text-pink-400" />
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
