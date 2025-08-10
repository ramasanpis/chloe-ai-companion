
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, Heart, Star, Gift } from 'lucide-react';

interface AdModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const AdModal: React.FC<AdModalProps> = ({ open, onClose, onComplete }) => {
  const [countdown, setCountdown] = useState(10);
  const [adCompleted, setAdCompleted] = useState(false);
  const [adStarted, setAdStarted] = useState(false);

  useEffect(() => {
    if (open) {
      setCountdown(10);
      setAdCompleted(false);
      setAdStarted(false);
    }
  }, [open]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (adStarted && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setAdCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [adStarted, countdown]);

  const startAd = () => {
    setAdStarted(true);
  };

  const handleComplete = () => {
    onComplete();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-purple-900/90 to-pink-900/90 backdrop-blur-lg border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white text-center flex items-center justify-center gap-2">
            <Gift className="h-5 w-5 text-pink-400" />
            Unlock Premium Content
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!adStarted ? (
            <div className="text-center space-y-4">
              <div className="bg-white/10 rounded-lg p-6">
                <Heart className="h-12 w-12 text-pink-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Watch a quick ad</h3>
                <p className="text-purple-200 text-sm">
                  Support the app and unlock exclusive content!
                </p>
              </div>
              
              <Button
                onClick={startAd}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Ad ({countdown}s)
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="bg-gradient-to-r from-pink-500/20 to-purple-600/20 rounded-lg p-8 border border-white/20">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full animate-spin" style={{ width: '80px', height: '80px', margin: '0 auto' }}></div>
                  <div className="relative bg-black rounded-full flex items-center justify-center text-white font-bold text-xl" style={{ width: '80px', height: '80px', margin: '0 auto' }}>
                    {countdown}
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <h3 className="text-white font-semibold">Premium Dating App</h3>
                  <p className="text-purple-200 text-sm">Find your perfect match today!</p>
                  <div className="flex justify-center gap-1">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>

              {adCompleted ? (
                <Button
                  onClick={handleComplete}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Claim Reward!
                </Button>
              ) : (
                <div className="text-purple-200 text-sm">
                  Please wait {countdown} more second{countdown !== 1 ? 's' : ''}...
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdModal;
