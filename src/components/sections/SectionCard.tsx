'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/card';

export interface SectionData {
  key: string;
  name: string;
  count: number;
  previewImages: string[];
}

interface SectionCardProps {
  section: SectionData;
  onClick: () => void;
}

export function SectionCard({ section, onClick }: SectionCardProps) {
  const previews = section.previewImages;

  return (
    <Card
      className="overflow-hidden hover:shadow-md hover:ring-primary/20 transition-all cursor-pointer group h-full"
      onClick={onClick}
    >
      <div className="p-4 flex gap-4 h-full">
        {/* 2x2 Preview Grid */}
        <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-muted grid grid-cols-2 grid-rows-2 gap-px">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="relative bg-muted">
              {previews[i] ? (
                <Image
                  src={previews[i]}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              ) : (
                <div className="w-full h-full bg-muted" />
              )}
            </div>
          ))}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
          <h3 className="font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {section.name}
          </h3>
          <span className="text-xs text-muted-foreground">
            {section.count} pin{section.count === 1 ? '' : 's'}
          </span>
        </div>
      </div>
    </Card>
  );
}
