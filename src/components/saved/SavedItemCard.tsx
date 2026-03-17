'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ExternalLink, RefreshCw, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import type { ProductResult, GoogleSyncStatus } from '@/lib/types/database';

interface SavedItemCardProps {
  product: ProductResult;
  savedAt: string;
  syncStatus: GoogleSyncStatus;
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
  onRetrySync?: () => void;
}

const syncStatusConfig: Record<GoogleSyncStatus, { icon: typeof CheckCircle; label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  synced: { icon: CheckCircle, label: 'Synced', variant: 'default' },
  pending: { icon: Clock, label: 'Pending', variant: 'outline' },
  failed: { icon: AlertCircle, label: 'Sync failed', variant: 'destructive' },
  not_configured: { icon: Clock, label: 'Sheets not set up', variant: 'outline' },
};

export function SavedItemCard({
  product,
  savedAt,
  syncStatus,
  selected,
  onSelect,
  onRetrySync,
}: SavedItemCardProps) {
  const syncConfig = syncStatusConfig[syncStatus];
  const SyncIcon = syncConfig.icon;

  return (
    <Card className={`overflow-hidden transition-shadow ${selected ? 'ring-2 ring-primary' : ''}`}>
      <CardContent className="p-0">
        <div className="flex gap-4">
          <div className="w-24 h-32 relative shrink-0 bg-muted">
            <Image
              src={product.image_url}
              alt={product.title}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>

          <div className="flex-1 py-3 pr-3 space-y-2">
            <div className="flex items-start gap-2">
              {onSelect && (
                <Checkbox
                  checked={selected}
                  onCheckedChange={onSelect}
                  className="mt-1"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm leading-tight line-clamp-2">{product.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{product.retailer}</span>
                  <span className="font-semibold text-sm">{product.price_text}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={syncConfig.variant} className="text-xs gap-1">
                <SyncIcon className="h-3 w-3" />
                {syncConfig.label}
              </Badge>
              {syncStatus === 'failed' && onRetrySync && (
                <Button variant="ghost" size="sm" onClick={onRetrySync} className="h-6 px-2 text-xs gap-1">
                  <RefreshCw className="h-3 w-3" />
                  Retry
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <a
                href={product.product_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                View product
              </a>
              <span className="text-xs text-muted-foreground">
                Saved {formatDate(savedAt)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString();
}
