'use client';

import { useState, useCallback } from 'react';
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '@/components/ui/button';
import { Crop as CropIcon, Maximize, RotateCcw } from 'lucide-react';

interface PinImageCropperProps {
  imageUrl: string;
  onCropComplete: (crop: PixelCrop | null) => void;
}

export function PinImageCropper({ imageUrl, onCropComplete }: PinImageCropperProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [isCropping, setIsCropping] = useState(false);

  const handleToggleCrop = useCallback(() => {
    if (isCropping) {
      setIsCropping(false);
      setCrop(undefined);
      setCompletedCrop(null);
      onCropComplete(null);
    } else {
      setIsCropping(true);
    }
  }, [isCropping, onCropComplete]);

  const handleConfirmCrop = useCallback(() => {
    onCropComplete(completedCrop);
  }, [completedCrop, onCropComplete]);

  const handleReset = useCallback(() => {
    setCrop(undefined);
    setCompletedCrop(null);
    onCropComplete(null);
  }, [onCropComplete]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button
          variant={isCropping ? 'default' : 'outline'}
          size="sm"
          onClick={handleToggleCrop}
          className="gap-2"
        >
          {isCropping ? <Maximize className="h-4 w-4" /> : <CropIcon className="h-4 w-4" />}
          {isCropping ? 'Cancel crop' : 'Select region'}
        </Button>
        {isCropping && completedCrop && (
          <>
            <Button size="sm" onClick={handleConfirmCrop} className="gap-2">
              <CropIcon className="h-4 w-4" />
              Use selection
            </Button>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      <div className="relative rounded-lg overflow-hidden bg-muted">
        {isCropping ? (
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Pin for cropping"
              className="max-w-full max-h-[600px] object-contain"
            />
          </ReactCrop>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={imageUrl}
            alt="Pin image"
            className="max-w-full max-h-[600px] object-contain mx-auto"
          />
        )}
      </div>

      {completedCrop && (
        <p className="text-xs text-muted-foreground">
          Selected region: {Math.round(completedCrop.width)} x {Math.round(completedCrop.height)}px
          at ({Math.round(completedCrop.x)}, {Math.round(completedCrop.y)})
        </p>
      )}
    </div>
  );
}
