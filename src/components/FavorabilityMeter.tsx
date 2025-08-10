
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Heart, Star, Crown } from 'lucide-react';

interface FavorabilityMeterProps {
  score: number;
  level: number;
}

const FavorabilityMeter: React.FC<FavorabilityMeterProps> = ({ score, level }) => {
  const currentLevelScore = score % 100;
  const progressPercentage = currentLevelScore;

  const getLevelIcon = (level: number) => {
    if (level >= 7) return <Crown className="h-5 w-5 text-yellow-400" />;
    if (level >= 4) return <Star className="h-5 w-5 text-purple-400" />;
    return <Heart className="h-5 w-5 text-pink-400" />;
  };

  const getLevelColor = (level: number) => {
    if (level >= 7) return 'from-yellow-400 to-orange-500';
    if (level >= 4) return 'from-purple-400 to-pink-500';
    return 'from-pink-400 to-red-500';
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold">Relationship</h3>
        <div className="flex items-center gap-2">
          {getLevelIcon(level)}
          <span className="text-white font-bold">LV{level}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-purple-200">Favorability</span>
          <span className="text-white">{score} pts</span>
        </div>
        
        <div className="relative">
          <Progress 
            value={progressPercentage} 
            className="h-3 bg-white/10"
          />
          <div 
            className={`absolute inset-0 h-3 bg-gradient-to-r ${getLevelColor(level)} rounded-full transition-all duration-500`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-purple-200">
          <span>{currentLevelScore}/100</span>
          <span>Next: LV{level + 1}</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <div className="text-center">
          <div className="text-white font-semibold">{Math.floor(score / 10)}</div>
          <div className="text-purple-200">Images</div>
        </div>
        <div className="text-center">
          <div className="text-white font-semibold">{level}</div>
          <div className="text-purple-200">Level</div>
        </div>
        <div className="text-center">
          <div className="text-white font-semibold">{score}</div>
          <div className="text-purple-200">Score</div>
        </div>
      </div>
    </div>
  );
};

export default FavorabilityMeter;
