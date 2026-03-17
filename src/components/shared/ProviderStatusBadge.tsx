import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

type Status = 'connected' | 'disconnected' | 'pending';

const statusConfig: Record<Status, { label: string; variant: 'default' | 'secondary' | 'outline'; icon: typeof CheckCircle }> = {
  connected: { label: 'Connected', variant: 'default', icon: CheckCircle },
  disconnected: { label: 'Not connected', variant: 'outline', icon: AlertCircle },
  pending: { label: 'Connecting\u2026', variant: 'secondary', icon: Clock },
};

export function ProviderStatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="gap-1 text-xs">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
