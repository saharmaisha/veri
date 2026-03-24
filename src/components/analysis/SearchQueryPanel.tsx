'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Search } from 'lucide-react';
import type { PinAnalysis } from '@/lib/types/database';

export function SearchQueryPanel({ analysis }: { analysis: PinAnalysis }) {
  const [open, setOpen] = useState(false);

  const queries = [
    { label: 'Broad', query: analysis.broad_query, description: 'More variety' },
    { label: 'Balanced', query: analysis.balanced_query, description: 'Recommended' },
    { label: 'Specific', query: analysis.specific_query, description: 'Closer match' },
  ];

  return (
    <Card>
      <CardHeader
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            Search queries
          </CardTitle>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </CardHeader>
      {open && (
        <CardContent className="space-y-3 pt-0">
          {queries.map((q) => (
            <div key={q.label} className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[11px] font-normal">{q.label}</Badge>
                <span className="text-[11px] text-muted-foreground">{q.description}</span>
              </div>
              <p className="text-xs font-mono bg-muted px-3 py-2 rounded-md leading-relaxed">{q.query}</p>
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  );
}
