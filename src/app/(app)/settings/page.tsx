'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProviderStatusBadge } from '@/components/shared/ProviderStatusBadge';
import { FileSpreadsheet, DollarSign, Loader2, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const searchParams = useSearchParams();

  const [budgetMax, setBudgetMax] = useState('150');
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [saving, setSaving] = useState(false);
  const [savingSheet, setSavingSheet] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(true);
  const [disconnecting, setDisconnecting] = useState(false);

  useEffect(() => {
    if (searchParams.get('google_connected') === 'true') {
      toast.success('Google account connected');
    }
    if (searchParams.get('error') === 'google_denied') {
      toast.error('Google connection was cancelled');
    }
    if (searchParams.get('error') === 'google_token_failed') {
      toast.error('Google connection failed. Please try again.');
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchIntegration = async () => {
      try {
        const [integrationRes, preferencesRes] = await Promise.all([
          fetch('/api/google/integration'),
          fetch('/api/preferences'),
        ]);
        const integrationData = await integrationRes.json();
        const preferencesData = await preferencesRes.json();
        setGoogleConnected(integrationData.connected || false);
        setSpreadsheetId(integrationData.spreadsheet_id || '');
        setBudgetMax(
          preferencesData.preferences?.default_budget_max !== null &&
            preferencesData.preferences?.default_budget_max !== undefined
            ? String(preferencesData.preferences.default_budget_max)
            : '150'
        );
      } catch {
        // Silently fail
      } finally {
        setLoadingGoogle(false);
      }
    };
    fetchIntegration();
  }, []);

  const handleConnectGoogle = () => {
    window.location.href = '/api/google/auth';
  };

  const handleDisconnectGoogle = async () => {
    setDisconnecting(true);
    try {
      await fetch('/api/google/disconnect', { method: 'POST' });
      setGoogleConnected(false);
      setSpreadsheetId('');
      toast.success('Google account disconnected');
    } catch {
      toast.error('Failed to disconnect');
    } finally {
      setDisconnecting(false);
    }
  };

  const handleSaveSheetId = async () => {
    if (!spreadsheetId.trim()) {
      toast.error('Enter a spreadsheet ID');
      return;
    }
    setSavingSheet(true);
    try {
      await fetch('/api/google/integration', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spreadsheet_id: spreadsheetId }),
      });
      toast.success('Spreadsheet saved');
    } catch {
      toast.error('Failed to save');
    } finally {
      setSavingSheet(false);
    }
  };

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
        <p className="text-sm text-muted-foreground">Manage your integrations and preferences.</p>
      </div>

      {/* Google Sheets */}
      <Card className="border-border/60">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <FileSpreadsheet className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-base">Google Sheets</CardTitle>
                <CardDescription>Export saved items to a spreadsheet</CardDescription>
              </div>
            </div>
            {loadingGoogle ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <ProviderStatusBadge status={googleConnected ? 'connected' : 'disconnected'} />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {googleConnected ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="spreadsheet-id">Spreadsheet ID</Label>
                <div className="flex gap-2">
                  <Input
                    id="spreadsheet-id"
                    placeholder="Paste your spreadsheet ID"
                    value={spreadsheetId}
                    onChange={(e) => setSpreadsheetId(e.target.value)}
                    className="h-9"
                  />
                  <Button onClick={handleSaveSheetId} disabled={savingSheet} size="sm" className="h-9 px-4">
                    {savingSheet ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Save'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Open your Google Sheet and copy the ID from the URL:
                  <br />
                  <code className="text-[11px] bg-muted px-1 py-0.5 rounded">docs.google.com/spreadsheets/d/<strong>your-id</strong>/edit</code>
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-destructive"
                onClick={handleDisconnectGoogle}
                disabled={disconnecting}
              >
                {disconnecting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LogOut className="h-3.5 w-3.5" />}
                Disconnect
              </Button>
            </>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Connect your Google account to automatically save items you swipe right on to a spreadsheet.
              </p>
              <Button onClick={handleConnectGoogle} size="sm" className="gap-2">
                <FileSpreadsheet className="h-3.5 w-3.5" />
                Connect Google Sheets
              </Button>
              <p className="text-xs text-muted-foreground">
                Only Google Sheets access is requested. We never read your Drive files.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shopping Preferences */}
      <Card className="border-border/60">
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
