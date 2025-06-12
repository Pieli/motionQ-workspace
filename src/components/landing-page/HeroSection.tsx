import React, { useState, useEffect } from 'react';
import { ChatInput } from './ChatInput';

const HeroSection: React.FC = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const texts = ['Product Launches', 'SaaS Demos', 'Brand Stories', 'Pitch Decks'];
  
  useEffect(() => {
    const currentText = texts[currentTextIndex];
    let charIndex = 0;
    
    if (isTyping) {
      const typeInterval = setInterval(() => {
        if (charIndex < currentText.length) {
          setDisplayText(currentText.slice(0, charIndex + 1));
          charIndex++;
        } else {
          setIsTyping(false);
          setTimeout(() => {
            setIsTyping(true);
            setCurrentTextIndex((prev) => (prev + 1) % texts.length);
            setDisplayText('');
          }, 2000);
          clearInterval(typeInterval);
        }
      }, 100);
      
      return () => clearInterval(typeInterval);
    }
  }, [currentTextIndex, isTyping]);

  return (
    <section className="flex flex-col justify-center items-center px-6 pt-20 pb-12 bg-gradient-to-br from-slate-50/90 via-blue-50/70 to-indigo-50/80 min-h-[70vh]">
      <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-foreground">
            Build{' '}
            <span className="relative inline-block min-w-[400px] text-left">
              <span className="text-primary font-bold">
                {displayText}
                <span className="animate-pulse text-primary">|</span>
              </span>
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Transform your ideas into stunning animated videos with AI
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <ChatInput />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

