import React, { useState } from "react";

import { Navbar } from "@/components/navbar/navbar";
import { ChatInput } from "@/components/chat/chat-input";

import { useNavigate } from "react-router-dom";

const StartPage: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const navigate = useNavigate();

  const handleSend = () => {
    if (!prompt.trim()) return;

    navigate("/workspace", {
      state: { initialPrompt: prompt},
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar children={[]} />
      <section className="flex flex-col justify-center items-center px-6 pt-20 pb-12 min-h-[70vh]">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-foreground">
              Build{" "}
              <span className="relative inline-block min-w-[400px] text-left">
                <span className="text-primary font-bold">
                  {"the world"}
                  <span className="animate-pulse text-primary">|</span>
                </span>
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium">
              Transform your ideas into animated videos.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <ChatInput
              prompt={prompt}
              setPrompt={setPrompt}
              onSend={handleSend}
              isGenerating={false}
            />
          </div>
        </div>
      </section>
      <section className="px-6 pt-20 pb-12 min-h-[70vh]">
        <h3>Your Projects</h3>
      </section>
    </div>
  );
};

export default StartPage;
