import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Edit3, Save, X, Camera, Heart, Star, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: any;
  onProfileUpdate: (profile: any) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  isOpen, 
  onClose, 
  userProfile, 
  onProfileUpdate 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(userProfile);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setEditedProfile(userProfile);
  }, [userProfile]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_profiles')
        .update({
          username: editedProfile.username,
        })
        .eq('id', user.id);

      if (error) throw error;

      onProfileUpdate(editedProfile);
      setIsEditing(false);
      toast({
        title: "Profile Updated!",
        description: "Your profile has been successfully updated.",
      });
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

  const getAchievements = () => {
    const achievements = [];
    if (userProfile?.level >= 5) achievements.push({ name: "Love Expert", icon: "💕" });
    if (userProfile?.favorability_score >= 500) achievements.push({ name: "Heartbreaker", icon: "💖" });
    if (userProfile?.daily_messages_sent >= 50) achievements.push({ name: "Chatterbox", icon: "💬" });
    return achievements;
  };

  const getProfileStats = () => [
    { label: "Level", value: userProfile?.level || 1, icon: Star },
    { label: "Favorability", value: userProfile?.favorability_score || 0, icon: Heart },
    { label: "Messages Today", value: userProfile?.daily_messages_sent || 0, icon: MessageSquare },
  ];

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
            className="w-full max-w-md max-h-[90vh] overflow-hidden"
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
                
                <div className="relative mx-auto mb-4">
                  <Avatar className="h-20 w-20 border-4 border-white/20">
                    <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-2xl">
                      {userProfile?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-white/20 hover:bg-white/30"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>

                {isEditing ? (
                  <div className="space-y-2">
                    <Input
                      value={editedProfile?.username || ''}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, username: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white text-center"
                      placeholder="Enter username"
                    />
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setEditedProfile(userProfile);
                        }}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <CardTitle className="text-white text-xl mb-2">
                      {userProfile?.username || 'User'}
                    </CardTitle>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Edit3 className="h-4 w-4 mr-1" />
                      Edit Profile
                    </Button>
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  {getProfileStats().map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm"
                    >
                      <stat.icon className="h-5 w-5 text-pink-400 mx-auto mb-1" />
                      <div className="text-white font-semibold text-lg">{stat.value}</div>
                      <div className="text-white/70 text-xs">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Achievements */}
                <div>
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    Achievements
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {getAchievements().map((achievement, index) => (
                      <motion.div
                        key={achievement.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                          {achievement.icon} {achievement.name}
                        </Badge>
                      </motion.div>
                    ))}
                    {getAchievements().length === 0 && (
                      <p className="text-white/60 text-sm">No achievements yet. Keep chatting to unlock them!</p>
                    )}
                  </div>
                </div>

                {/* Companion Info */}
                <div>
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Heart className="h-4 w-4 text-pink-400" />
                    Current Companion
                  </h3>
                  <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {userProfile?.selected_girlfriend_id === 'aria' ? '💖' :
                         userProfile?.selected_girlfriend_id === 'luna' ? '🌙' :
                         userProfile?.selected_girlfriend_id === 'zara' ? '⚡' :
                         userProfile?.selected_girlfriend_id === 'sage' ? '🌿' :
                         userProfile?.selected_girlfriend_id === 'nova' ? '🚀' :
                         userProfile?.selected_girlfriend_id === 'ruby' ? '💎' : '💖'}
                      </div>
                      <div>
                        <div className="text-white font-medium capitalize">
                          {userProfile?.selected_girlfriend_id || 'None'}
                        </div>
                        <div className="text-white/70 text-sm">
                          Level {userProfile?.level || 1} Relationship
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserProfile;