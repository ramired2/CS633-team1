import React from 'react';
import { Button } from './ui/button';
import { X } from 'lucide-react';

interface ImageViewerProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export function ImageViewer({ src, alt, onClose }: ImageViewerProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
      <div className="relative max-w-full max-h-full p-4">
        <Button
          onClick={onClose}
          className="absolute top-4 right-4 p-3 z-10 bg-white hover:bg-gray-100 text-black"
          size="sm"
        >
          <X className="h-6 w-6" />
        </Button>
        <img 
          src={src} 
          alt={alt}
          className="max-w-full max-h-full object-contain rounded-lg"
        />
      </div>
    </div>
  );
}