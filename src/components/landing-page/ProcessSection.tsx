import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, FileText, Video, ArrowRight } from 'lucide-react';

const ProcessSection: React.FC = () => {
  const steps = [
    {
      icon: MessageSquare,
      number: "01",
      title: "Describe Your Product",
      description: "Start by describing your product, service, or idea in natural language. Include key features, benefits, target audience, and what makes it unique. Our AI understands context and extracts the essential elements for your video.",
      details: [
        "Product features & benefits",
        "Target audience analysis", 
        "Unique value proposition",
        "Key messaging points"
      ]
    },
    {
      icon: FileText,
      number: "02", 
      title: "AI Generates Script",
      description: "Our advanced AI analyzes your input and crafts a compelling, professional script optimized for video content. It structures your message using proven storytelling techniques and persuasive frameworks.",
      details: [
        "Narrative structure optimization",
        "Persuasive copywriting techniques",
        "Audience-specific messaging",
        "Call-to-action integration"
      ]
    },
    {
      icon: Video,
      number: "03",
      title: "Creates Professional Animation",
      description: "Watch as our AI transforms the script into stunning animated visuals. Dynamic scenes, smooth transitions, professional voiceover, and eye-catching graphics come together automatically.",
      details: [
        "Dynamic scene generation",
        "Smooth transitions & effects",
        "Professional voiceover synthesis",
        "Brand-consistent visuals"
      ]
    }
  ];

  return (
    <section id="process" className="pt-40 pb-32 px-6 bg-gradient-to-br from-emerald-50/70 via-teal-50/60 to-cyan-50/80">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            From Idea to Motion Graphic in One Step.
          </h2>
          <p className="text-xl p-8 text-muted-foreground max-w-3xl mx-auto">
             Moccasso is an  AI-powered animation tool that turns plain-text descriptions into videos without requiring any animation knowledge. 
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 relative">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="h-full bg-card border-2 border-border shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-md border-2 border-primary">
                      <step.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="text-4xl font-bold bg-primary text-primary-foreground px-3 py-1 rounded-lg border-2 border-primary shadow-md">
                      {step.number}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">{step.description}</p>
                  
                  <div className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                        {detail}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute right-[-1.5rem] top-1/2 transform -translate-y-1/2 z-10">
                  <div className="bg-background border-2 border-border rounded-full p-2 shadow-md">
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
