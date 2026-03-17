'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Sparkles, ArrowRight, Pin } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [budget, setBudget] = useState('150');
  const [excludeLuxury, setExcludeLuxury] = useState(true);

  const steps = [
    {
      title: 'Welcome to Swipe',
      description: 'We help you find affordable versions of outfits you love on Pinterest.',
      content: (
        <div className="flex flex-col items-center gap-6 py-8">
          <Sparkles className="h-16 w-16 text-primary" />
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              Connect your Pinterest, pick a board, and we&apos;ll find you better deals on similar items.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Set your budget',
      description: 'We\'ll prioritize items within your price range.',
      content: (
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="budget">Maximum budget per item</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="budget"
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="pl-8"
                min={0}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Exclude luxury brands</Label>
              <p className="text-sm text-muted-foreground">Skip designer and high-end retailers</p>
            </div>
            <Switch checked={excludeLuxury} onCheckedChange={setExcludeLuxury} />
          </div>
        </div>
      ),
    },
    {
      title: 'Connect Pinterest',
      description: 'Link your Pinterest account to import boards.',
      content: (
        <div className="flex flex-col items-center gap-6 py-8">
          <Pin className="h-16 w-16 text-red-500" />
          <p className="text-muted-foreground text-center">
            Connect your Pinterest to import your saved boards, or skip to paste board URLs directly.
          </p>
          <Button
            variant="outline"
            onClick={() => router.push('/settings')}
          >
            Connect Pinterest
          </Button>
        </div>
      ),
    },
  ];

  const current = steps[step];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
      <div className="w-full max-w-lg">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full ${
                    i <= step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <CardTitle>{current.title}</CardTitle>
            <CardDescription>{current.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {current.content}
            <div className="flex justify-between mt-6">
              {step > 0 ? (
                <Button variant="ghost" onClick={() => setStep(step - 1)}>
                  Back
                </Button>
              ) : (
                <div />
              )}
              <Button
                onClick={() => {
                  if (step < steps.length - 1) {
                    setStep(step + 1);
                  } else {
                    router.push('/boards');
                  }
                }}
              >
                {step < steps.length - 1 ? 'Next' : 'Get started'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
