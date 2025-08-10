import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import ChatHeader from '@/components/ChatHeader';
import MessageBubble from '@/components/MessageBubble';
import AdModal from '@/components/AdModal';
import FavorabilityMeter from '@/components/FavorabilityMeter';
import DailyTasks from '@/components/DailyTasks';
import { Send, Menu } from 'lucide-react';

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

interface UserProfile {
  username: string;
  selected_girlfriend_id: string;
  favorability_score: number;
  level: number;
  daily_messages_sent: number;
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showAdModal, setShowAdModal] = useState(false);
  const [pendingImageMessage, setPendingImageMessage] = useState<string | null>(null);
  const [contextTopic, setContextTopic] = useState<string>('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [customTextPrompt, setCustomTextPrompt] = useState('');
  const [customImagePrompt, setCustomImagePrompt] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadUserProfile();
    loadMessages();
    loadCustomPrompts();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadCustomPrompts = () => {
    const savedTextPrompt = localStorage.getItem('customTextPrompt') || '';
    const savedImagePrompt = localStorage.getItem('customImagePrompt') || '';
    setCustomTextPrompt(savedTextPrompt);
    setCustomImagePrompt(savedImagePrompt);
  };

  const handleSettingsChange = (settings: { textPrompt: string; imagePrompt: string }) => {
    setCustomTextPrompt(settings.textPrompt);
    setCustomImagePrompt(settings.imagePrompt);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const generateAIResponse = async (userMessage: string): Promise<{ text: string; hasImage?: boolean; imageContext?: string }> => {
    try {
      // Check if user is asking for an image
      const imageKeywords = ['pic', 'picture', 'photo', 'image', 'show me', 'selfie', 'send'];
      const hasImageRequest = imageKeywords.some(keyword => 
        userMessage.toLowerCase().includes(keyword)
      );

      if (hasImageRequest) {
        // Extract context or use previous context
        let imageContext = contextTopic;
        if (userMessage.toLowerCase().includes('beach')) imageContext = 'beach';
        else if (userMessage.toLowerCase().includes('cute')) imageContext = 'cute';
        else if (userMessage.toLowerCase().includes('dress')) imageContext = 'dress';
        else if (!imageContext) imageContext = 'portrait';

        setContextTopic(imageContext);

        return {
          text: "I'd love to share a photo with you! 📸✨ Just watch this quick ad to unlock it 💕",
          hasImage: true,
          imageContext
        };
      }

      // Generate text response using our edge function with custom prompt
      const promptToUse = customTextPrompt || userMessage;
      const { data, error } = await supabase.functions.invoke('generate-text', {
        body: { 
          prompt: customTextPrompt 
            ? `${customTextPrompt}. User message: ${userMessage}`
            : userMessage 
        }
      });

      if (error) throw error;

      return {
        text: data.message || "Sorry babe, I'm having trouble thinking right now 💕"
      };
    } catch (error) {
      console.error('Error generating AI response:', error);
      return {
        text: "Oops! Something went wrong, but I still love you! 💖"
      };
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    setLoading(true);
    const messageText = inputMessage;
    setInputMessage('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Save user message
      const { data: userMessageData, error: userError } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          message: messageText,
          is_user: true
        })
        .select()
        .single();

      if (userError) throw userError;

      setMessages(prev => [...prev, userMessageData]);

      // Generate AI response
      const aiResponse = await generateAIResponse(messageText);

      // Save AI message
      const { data: aiMessageData, error: aiError } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          message: aiResponse.text,
          is_user: false,
          has_image: aiResponse.hasImage || false,
          context_topic: aiResponse.imageContext || null
        })
        .select()
        .single();

      if (aiError) throw aiError;

      setMessages(prev => [...prev, aiMessageData]);

      // Update daily messages count and favorability
      if (userProfile) {
        const newCount = userProfile.daily_messages_sent + 1;
        const favorabilityBonus = Math.floor(newCount / 5); // Bonus every 5 messages
        const newScore = userProfile.favorability_score + 1 + favorabilityBonus;
        const newLevel = Math.floor(newScore / 100) + 1;

        await supabase
          .from('user_profiles')
          .update({ 
            daily_messages_sent: newCount,
            favorability_score: newScore,
            level: newLevel
          })
          .eq('id', user.id);

        setUserProfile({ 
          ...userProfile, 
          daily_messages_sent: newCount,
          favorability_score: newScore,
          level: newLevel
        });
      }

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

  const handleImageUnlock = async (messageId: string) => {
    setPendingImageMessage(messageId);
    setShowAdModal(true);
  };

  const handleAdComplete = async () => {
    if (!pendingImageMessage) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get the message to find the context
      const message = messages.find(m => m.id === pendingImageMessage);
      const context = message?.context_topic || 'portrait';

      // Use custom image prompt if available
      const basePrompt = customImagePrompt || 'Beautiful anime girlfriend';
      
      // Generate image using our edge function
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { 
          prompt: basePrompt,
          context: context
        }
      });

      if (error) throw error;

      const imageUrl = data.imageUrl;

      // Update message with unlocked image
      await supabase
        .from('chat_messages')
        .update({ 
          image_unlocked: true,
          image_url: imageUrl
        })
        .eq('id', pendingImageMessage);

      // Update favorability score (bonus for unlocking images)
      const newScore = (userProfile?.favorability_score || 0) + 15;
      const newLevel = Math.floor(newScore / 100) + 1;

      await supabase
        .from('user_profiles')
        .update({ 
          favorability_score: newScore,
          level: newLevel
        })
        .eq('id', user.id);

      if (userProfile) {
        setUserProfile({
          ...userProfile,
          favorability_score: newScore,
          level: newLevel
        });
      }

      // Reload messages to show unlocked image
      loadMessages();

      toast({
        title: "Image Unlocked!",
        description: "You gained 15 favorability points! 💖",
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setShowAdModal(false);
      setPendingImageMessage(null);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut({ scope: 'global' });
      window.location.href = '/auth';
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-400"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-black/30 backdrop-blur-xl transform ${showSidebar ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 lg:relative lg:translate-x-0 border-r border-white/10`}>
        <div className="p-4 h-full flex flex-col">
          <FavorabilityMeter 
            score={userProfile.favorability_score} 
            level={userProfile.level} 
          />
          <div className="mt-6 flex-1">
            <DailyTasks messagesSent={userProfile.daily_messages_sent} />
          </div>
          <Button 
            onClick={handleSignOut}
            variant="outline"
            className="mt-4 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <ChatHeader 
          girlfriendId={userProfile.selected_girlfriend_id}
          onMenuClick={() => setShowSidebar(!showSidebar)}
          onSettingsChange={handleSettingsChange}
        />

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onImageUnlock={() => handleImageUnlock(message.id)}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10 bg-black/10 backdrop-blur-sm">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type something sweet..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-purple-200"
              disabled={loading}
            />
            <Button
              onClick={sendMessage}
              disabled={loading || !inputMessage.trim()}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Ad Modal */}
      <AdModal
        open={showAdModal}
        onClose={() => setShowAdModal(false)}
        onComplete={handleAdComplete}
      />

      {/* Mobile overlay */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </div>
  );
};

export default ChatPage;
