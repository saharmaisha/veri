'use client';

import { useState, useCallback } from 'react';
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crop as CropIcon, RotateCcw } from 'lucide-react';

interface PinCropModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  pinTitle?: string | null;
  existingCrop?: PixelCrop | null;
  onSave: (crop: PixelCrop | null) => void;
}

export function PinCropModal({
  open,
  onOpenChange,
  imageUrl,
  pinTitle,
  existingCrop,
  onSave,
}: PinCropModalProps) {
  const [crop, setCrop] = useState<Crop | undefined>(() => {
    if (existingCrop) {
      return {
        unit: 'px',
        x: existingCrop.x,
        y: existingCrop.y,
        width: existingCrop.width,
        height: existingCrop.height,
      };
    }
    return undefined;
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(existingCrop || null);

  const handleReset = useCallback(() => {
    setCrop(undefined);
    setCompletedCrop(null);
  }, []);

  const handleSave = useCallback(() => {
    onSave(completedCrop);
    onOpenChange(false);
  }, [completedCrop, onSave, onOpenChange]);

  const handleClear = useCallback(() => {
    onSave(null);
    onOpenChange(false);
  }, [onSave, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {pinTitle ? `Crop: ${pinTitle}` : 'Crop pin'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Select an area to focus the search on a specific part of this pin.
          </p>

          <div className="relative rounded-lg overflow-hidden bg-muted">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Pin for cropping"
                className="max-w-full max-h-[50vh] object-contain mx-auto"
              />
            </ReactCrop>
          </div>

          {completedCrop && (
            <p className="text-xs text-muted-foreground">
              Selected: {Math.round(completedCrop.width)} x {Math.round(completedCrop.height)}px
            </p>
          )}
        </div>

        <DialogFooter>
          {existingCrop && (
            <Button variant="ghost" size="sm" onClick={handleClear} className="mr-auto">
              Clear crop
            </Button>
          )}
          {completedCrop && (
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          )}
          <Button size="sm" onClick={handleSave} className="gap-2">
            <CropIcon className="h-4 w-4" />
            {completedCrop ? 'Save crop' : 'Use full image'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
