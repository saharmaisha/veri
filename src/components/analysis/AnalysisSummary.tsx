'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { PinAnalysis } from '@/lib/types/database';

export function AnalysisSummary({ analysis }: { analysis: PinAnalysis }) {
  const attributes = [
    { label: 'Category', value: analysis.category },
    { label: 'Color', value: analysis.primary_color },
    { label: 'Silhouette', value: analysis.silhouette },
    { label: 'Neckline', value: analysis.neckline },
    { label: 'Sleeves', value: analysis.sleeve_length },
    { label: 'Length', value: analysis.length },
    { label: 'Fit', value: analysis.fit },
    { label: 'Material', value: analysis.material_or_texture },
    { label: 'Occasion', value: analysis.occasion },
    { label: 'Strap', value: analysis.strap_type },
  ].filter((a) => a.value);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">What we found</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed">{analysis.short_description}</p>

        <div className="flex flex-wrap gap-1.5">
          {attributes.map((attr) => (
            <Badge key={attr.label} variant="secondary" className="text-xs font-normal">
              {attr.label}: {attr.value}
            </Badge>
          ))}
        </div>

        {analysis.style_keywords.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">Style</p>
            <div className="flex flex-wrap gap-1">
              {analysis.style_keywords.map((kw) => (
                <Badge key={kw} variant="outline" className="text-xs font-normal">
                  {kw}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {analysis.notable_details.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">Details</p>
            <div className="flex flex-wrap gap-1">
              {analysis.notable_details.map((detail) => (
                <Badge key={detail} variant="outline" className="text-xs font-normal">
                  {detail}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
