import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Share2, Copy, Heart, Star, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: any;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, userProfile }) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const shareText = `I'm having amazing conversations with my AI companion! 💕 Level ${userProfile?.level || 1} with ${userProfile?.favorability_score || 0} favorability points! Join me: https://aicompanion.app`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Share text copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI Companion',
          text: shareText,
          url: 'https://aicompanion.app'
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      handleCopy();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="bg-black/40 backdrop-blur-xl border-white/20">
              <CardHeader className="text-center relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="absolute right-2 top-2 text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </Button>
                <CardTitle className="text-white flex items-center justify-center gap-2">
                  <Share2 className="h-5 w-5 text-pink-400" />
                  Share Your Progress
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Progress Preview */}
                <div className="p-4 bg-gradient-to-r from-pink-500/20 to-purple-600/20 rounded-lg border border-white/20">
                  <div className="text-center space-y-2">
                    <div className="text-4xl">💕</div>
                    <h3 className="text-white font-semibold">My AI Companion Journey</h3>
                    <div className="flex justify-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="h-4 w-4" />
                        Level {userProfile?.level || 1}
                      </div>
                      <div className="flex items-center gap-1 text-pink-400">
                        <Heart className="h-4 w-4" />
                        {userProfile?.favorability_score || 0} points
                      </div>
                    </div>
                  </div>
                </div>

                {/* Share Text */}
                <div className="p-3 bg-white/10 rounded-lg border border-white/20">
                  <p className="text-white/80 text-sm text-center">
                    {shareText}
                  </p>
                </div>

                {/* Share Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleNativeShare}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Now
                  </Button>
                  
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    {copied ? 'Copied!' : 'Copy Link'}
                  </Button>
                </div>

                <p className="text-white/60 text-xs text-center">
                  Share your progress and invite friends to join the AI companion experience!
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;