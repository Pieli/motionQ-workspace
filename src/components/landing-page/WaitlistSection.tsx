import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Mail, Key } from 'lucide-react';

const WaitlistSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [activeTab, setActiveTab] = useState<'email' | 'invite'>('email');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email submitted:', email);
    // Handle email submission
    setEmail('');
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Invite code submitted:', inviteCode);
    // Handle invite code submission
    setInviteCode('');
  };

  return (
    <section className="py-16 px-6 bg-gradient-to-br from-violet-50/70 via-purple-50/60 to-pink-50/80 flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Ready to Create Amazing Animations?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of creators who are already transforming their ideas into stunning animated videos
          </p>
        </div>

        <Card className="max-w-md mx-auto bg-card border-2 border-border shadow-xl rounded-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-foreground">Get Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex rounded-lg border-2 border-border overflow-hidden bg-muted">
              <button
                onClick={() => setActiveTab('email')}
                className={`flex-1 py-3 px-4 font-medium transition-all border-r border-border ${
                  activeTab === 'email'
                    ? 'bg-primary text-primary-foreground shadow-md border-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <Mail className="w-4 h-4 inline mr-2" />
                Join Waitlist
              </button>
              <button
                onClick={() => setActiveTab('invite')}
                className={`flex-1 py-3 px-4 font-medium transition-all ${
                  activeTab === 'invite'
                    ? 'bg-primary text-primary-foreground shadow-md border-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <Key className="w-4 h-4 inline mr-2" />
                Have Code?
              </button>
            </div>

            <Separator className="bg-border" />

            {activeTab === 'email' ? (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-2 border-border text-foreground placeholder:text-muted-foreground focus:ring-primary rounded-lg"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg rounded-lg border-2 border-primary"
                >
                  Join the Waitlist
                </Button>
                <p className="text-sm text-muted-foreground">
                  Be the first to know when we launch. No spam, just updates.
                </p>
              </form>
            ) : (
              <form onSubmit={handleInviteSubmit} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Enter your invite code"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    className="border-2 border-border text-foreground placeholder:text-muted-foreground focus:ring-primary rounded-lg"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-chart-4 hover:bg-chart-4/90 text-background font-semibold shadow-lg rounded-lg border-2 border-chart-4"
                >
                  Access Moccasso 
                </Button>
                <p className="text-sm text-muted-foreground">
                  Have an invite code? Enter it above to get immediate access.
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default WaitlistSection;
