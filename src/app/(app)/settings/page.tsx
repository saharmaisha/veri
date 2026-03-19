'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTourTrigger } from '@/components/tour/useTourTrigger';

export default function SettingsPage() {
  const [budgetMax, setBudgetMax] = useState('150');
  const [saving, setSaving] = useState(false);

  useTourTrigger('settings');

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch('/api/preferences');
        const data = await response.json();
        setBudgetMax(
          data.preferences?.default_budget_max !== null &&
            data.preferences?.default_budget_max !== undefined
            ? String(data.preferences.default_budget_max)
            : '150'
        );
      } catch {
        // Silently fail
      }
    };
    fetchPreferences();
  }, []);

  const handleSavePreferences = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          default_budget_max: budgetMax ? Number(budgetMax) : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }

      toast.success('Preferences saved');
    } catch {
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your preferences.</p>
      </div>

      {/* Shopping Preferences */}
      <Card data-tour="budget-settings" className="border-border/60">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Shopping</CardTitle>
              <CardDescription>Default search preferences</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="budget-max">Default max budget per item</Label>
            <div className="relative max-w-[160px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input
                id="budget-max"
                type="number"
                value={budgetMax}
                onChange={(e) => setBudgetMax(e.target.value)}
                className="pl-7 h-9"
                min={0}
              />
            </div>
          </div>

          <Button onClick={handleSavePreferences} disabled={saving} size="sm" className="gap-2">
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            {saving ? 'Saving\u2026' : 'Save preferences'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
