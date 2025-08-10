
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import AuthPage from '@/pages/AuthPage';
import ProfilePicker from '@/pages/ProfilePicker';
import ChatPage from '@/pages/ChatPage';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        checkUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setTimeout(() => {
          checkUserProfile(session.user.id);
        }, 0);
      } else {
        setHasProfile(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('selected_girlfriend_id')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error checking profile:', error);
        setHasProfile(false);
      } else {
        setHasProfile(!!data?.selected_girlfriend_id);
      }
    } catch (error) {
      console.error('Error checking profile:', error);
      setHasProfile(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-400"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Routes>
          <Route 
            path="/auth" 
            element={!session ? <AuthPage /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/profile-picker" 
            element={session && !hasProfile ? <ProfilePicker onProfileSelected={() => setHasProfile(true)} /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/" 
            element={
              session 
                ? hasProfile 
                  ? <ChatPage /> 
                  : <Navigate to="/profile-picker" replace />
                : <Navigate to="/auth" replace />
            } 
          />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
