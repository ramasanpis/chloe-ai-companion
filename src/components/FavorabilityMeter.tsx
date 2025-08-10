
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Heart, Star } from 'lucide-react';

interface FavorabilityMeterProps {
  score: number;
  level: number;
}

const FavorabilityMeter: React.FC<FavorabilityMeterProps> = ({ score, level }) => {
  const progressInLevel = score % 100;
  const nextLevelScore = (level * 100);

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-lg p-4 border border-white/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-pink-400" />
          <span className="text-white font-semibold">Level {level}</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 text-yellow-400" />
          <span className="text-white text-sm">{score}</span>
        </div>
      </div>
      
      <Progress 
        value={progressInLevel} 
        className="h-2 bg-white/20"
      />
      
      <div className="flex justify-between text-xs text-white/70 mt-2">
        <span>{progressInLevel}/100</span>
        <span>Next: LV{level + 1}</span>
      </div>
      
      <div className="mt-3 text-center">
        <div className="text-2xl mb-1">
          {level >= 5 ? '💖' : level >= 3 ? '💕' : '💗'}
        </div>
        <p className="text-xs text-white/80">
          {level >= 7 ? 'Deeply in love!' : 
           level >= 5 ? 'Very close!' : 
           level >= 3 ? 'Getting closer!' : 
           'Building connection...'}
        </p>
      </div>
    </div>
  );
};

export default FavorabilityMeter;
