
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
import { Send, Image, Menu } from 'lucide-react';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadUserProfile();
    loadMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    // Simulate AI response - in a real app, you'd call an AI API here
    const responses = [
      "That's so sweet of you to say! 💖",
      "I love chatting with you! What's on your mind?",
      "You always know how to make me smile! ✨",
      "I've been thinking about you too! 😊",
      "Tell me more about your day!",
      "You're such good company! 💕"
    ];

    // Check if user is asking for an image
    const imageKeywords = ['pic', 'picture', 'photo', 'image', 'show me', 'selfie'];
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
        text: "I'd love to share a photo with you! 📸✨",
        hasImage: true,
        imageContext
      };
    }

    return {
      text: responses[Math.floor(Math.random() * responses.length)]
    };
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

      // Update daily messages count
      if (userProfile) {
        const newCount = userProfile.daily_messages_sent + 1;
        await supabase
          .from('user_profiles')
          .update({ daily_messages_sent: newCount })
          .eq('id', user.id);

        setUserProfile({ ...userProfile, daily_messages_sent: newCount });
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

      // Generate image URL (in a real app, you'd call an AI image API)
      const imageUrl = `https://picsum.photos/400/600?random=${Date.now()}`;

      // Update message with unlocked image
      await supabase
        .from('chat_messages')
        .update({ 
          image_unlocked: true,
          image_url: imageUrl
        })
        .eq('id', pendingImageMessage);

      // Update favorability score
      const newScore = (userProfile?.favorability_score || 0) + 10;
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
        description: "You gained 10 favorability points! 💖",
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-400"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-black/30 backdrop-blur-lg transform ${showSidebar ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 lg:relative lg:translate-x-0`}>
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
            className="mt-4 bg-white/10 border-white/20 text-white hover:bg-white/20"
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
        <div className="p-4 border-t border-white/10">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
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
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </div>
  );
};

export default ChatPage;
