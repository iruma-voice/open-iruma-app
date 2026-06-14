'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ExpandableImageProps {
  src: string;
  alt: string;
}

export default function ExpandableImage({ src, alt }: ExpandableImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div 
        className="relative w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-50 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <img src={src} alt={alt} className="w-full h-auto object-contain" />
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setIsOpen(false)}
        >
          <button 
            className="absolute top-4 right-4 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={src} 
            alt={alt} 
            className="max-w-full max-h-full object-contain rounded-md shadow-2xl" 
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
