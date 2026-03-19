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
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('150');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useTourTrigger('settings');

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch('/api/preferences');
        const data = await response.json();
        const prefs = data.preferences;
        if (prefs) {
          setBudgetMin(prefs.default_budget_min !== null ? String(prefs.default_budget_min) : '');
          setBudgetMax(prefs.default_budget_max !== null ? String(prefs.default_budget_max) : '150');
        }
      } catch {
        // Silently fail
      } finally {
        setLoading(false);
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
          default_budget_min: budgetMin ? Number(budgetMin) : null,
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

      {/* Budget Preferences */}
      <Card data-tour="budget-settings" className="border-border/60">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Budget</CardTitle>
              <CardDescription>Set your default price range</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="budget-min">Min budget</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <Input
                  id="budget-min"
                  type="number"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(e.target.value)}
                  className="pl-7 h-9"
                  min={0}
                  placeholder="0"
                  disabled={loading}
                />
              </div>
            </div>
            <div className="space-y-2 flex-1">
              <Label htmlFor="budget-max">Max budget</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <Input
                  id="budget-max"
                  type="number"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                  className="pl-7 h-9"
                  min={0}
                  placeholder="150"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Leave min empty to search from $0. Leave max empty for no upper limit.
          </p>
        </CardContent>
      </Card>

      <Button onClick={handleSavePreferences} disabled={saving || loading} className="gap-2">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {saving ? 'Saving\u2026' : 'Save preferences'}
      </Button>
    </div>
  );
}
