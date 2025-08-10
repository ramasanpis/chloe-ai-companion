
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SettingsProps {
  onSave: (settings: { textPrompt: string; imagePrompt: string }) => void;
}

const Settings: React.FC<SettingsProps> = ({ onSave }) => {
  const [textPrompt, setTextPrompt] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved prompts from localStorage
    const savedTextPrompt = localStorage.getItem('customTextPrompt');
    const savedImagePrompt = localStorage.getItem('customImagePrompt');
    
    if (savedTextPrompt) setTextPrompt(savedTextPrompt);
    if (savedImagePrompt) setImagePrompt(savedImagePrompt);
  }, []);

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('customTextPrompt', textPrompt);
    localStorage.setItem('customImagePrompt', imagePrompt);
    
    // Call parent callback
    onSave({ textPrompt, imagePrompt });
    
    setOpen(false);
    toast({
      title: "Settings Saved",
      description: "Your custom prompts have been updated! 💖",
    });
  };

  const handleReset = () => {
    setTextPrompt('');
    setImagePrompt('');
    localStorage.removeItem('customTextPrompt');
    localStorage.removeItem('customImagePrompt');
    onSave({ textPrompt: '', imagePrompt: '' });
    
    toast({
      title: "Settings Reset",
      description: "Custom prompts have been cleared! 🔄",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10"
        >
          <SettingsIcon className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/40 backdrop-blur-xl border border-white/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-center">Customize Your AI 💕</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="textPrompt" className="text-white/90">
              Chat Personality Prompt
            </Label>
            <Textarea
              id="textPrompt"
              value={textPrompt}
              onChange={(e) => setTextPrompt(e.target.value)}
              placeholder="e.g., Reply as a sweet, caring girlfriend who loves anime and gaming..."
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[80px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imagePrompt" className="text-white/90">
              Image Style Prompt
            </Label>
            <Textarea
              id="imagePrompt"
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              placeholder="e.g., anime style, beautiful girlfriend, cute expression, high quality..."
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[80px]"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Reset
            </Button>
          </div>
          
          <div className="text-xs text-white/70 space-y-1">
            <p>💡 Leave empty to use default prompts</p>
            <p>🎨 Custom prompts apply to all new messages</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Settings;
