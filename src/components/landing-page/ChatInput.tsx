import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ChatInput: React.FC = () => {
  const [input, setInput] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setInput('');
    }
  };

  return (
    <div className="relative group">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-4 flex items-center space-x-2 text-muted-foreground">
            <Sparkles className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your product or idea..."
            className="w-full pl-12 pr-14 py-4 text-lg bg-card border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 shadow-lg hover:shadow-xl rounded-lg"
          />
          <Button
            type="submit"
            size="sm"
            className="absolute right-2 p-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md rounded-lg border-2 border-primary"
            disabled={!input.trim()}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </div>
  );
};

