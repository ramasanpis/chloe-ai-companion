
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Sparkles, Heart, Zap } from 'lucide-react';

interface GirlfriendProfile {
  id: string;
  name: string;
  description: string;
  personality: string;
  avatar: string;
  theme: string;
}

const girlfriendProfiles: GirlfriendProfile[] = [
  {
    id: 'aria',
    name: 'Aria',
    description: 'Sweet and caring with a love for books and cozy evenings',
    personality: 'gentle, intellectual, romantic',
    avatar: '💖',
    theme: 'from-pink-400 to-rose-500'
  },
  {
    id: 'luna',
    name: 'Luna',
    description: 'Mysterious and enchanting with a passion for stargazing',
    personality: 'mysterious, dreamy, artistic',
    avatar: '🌙',
    theme: 'from-purple-400 to-indigo-500'
  },
  {
    id: 'zara',
    name: 'Zara',
    description: 'Energetic and adventurous, always ready for new experiences',
    personality: 'energetic, adventurous, spontaneous',
    avatar: '⚡',
    theme: 'from-orange-400 to-red-500'
  },
  {
    id: 'sage',
    name: 'Sage',
    description: 'Wise and calming, loves nature and deep conversations',
    personality: 'wise, calming, nature-loving',
    avatar: '🌿',
    theme: 'from-green-400 to-emerald-500'
  },
  {
    id: 'nova',
    name: 'Nova',
    description: 'Playful and tech-savvy with a futuristic vibe',
    personality: 'playful, tech-savvy, futuristic',
    avatar: '🚀',
    theme: 'from-cyan-400 to-blue-500'
  },
  {
    id: 'ruby',
    name: 'Ruby',
    description: 'Confident and passionate with a fiery spirit',
    personality: 'confident, passionate, bold',
    avatar: '💎',
    theme: 'from-red-400 to-pink-500'
  }
];

interface ProfilePickerProps {
  onProfileSelected: () => void;
}

const ProfilePicker: React.FC<ProfilePickerProps> = ({ onProfileSelected }) => {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSelectProfile = async (profileId: string) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('user_profiles')
        .update({ selected_girlfriend_id: profileId })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile Selected!",
        description: `You've chosen ${girlfriendProfiles.find(p => p.id === profileId)?.name}. Let the conversation begin!`,
      });

      onProfileSelected();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Choose Your Companion</h1>
          <p className="text-purple-200 text-lg">Select the AI girlfriend that speaks to your heart</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {girlfriendProfiles.map((profile) => (
            <Card
              key={profile.id}
              className={`cursor-pointer transition-all duration-300 backdrop-blur-lg bg-white/10 border-white/20 hover:bg-white/20 hover:scale-105 ${
                selectedProfile === profile.id ? 'ring-2 ring-pink-400 bg-white/20' : ''
              }`}
              onClick={() => setSelectedProfile(profile.id)}
            >
              <CardHeader className="text-center">
                <div className={`text-6xl mb-4 p-4 rounded-full bg-gradient-to-r ${profile.theme} w-fit mx-auto`}>
                  {profile.avatar}
                </div>
                <CardTitle className="text-white text-xl">{profile.name}</CardTitle>
                <CardDescription className="text-purple-200 text-sm">
                  {profile.personality}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-purple-100 text-center mb-4">{profile.description}</p>
                {selectedProfile === profile.id && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectProfile(profile.id);
                    }}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                  >
                    {loading ? 'Selecting...' : 'Choose ' + profile.name}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePicker;
