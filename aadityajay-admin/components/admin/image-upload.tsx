'use client';

import { useState, useRef, useCallback } from 'react';
import { uploadImage } from '@/lib/upload';
import { cn } from '@/lib/utils';
import { Loader2, Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
  label?: string;
  aspect?: 'square' | 'video' | 'wide';
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  folder = 'misc',
  label = 'Image',
  aspect = 'wide',
  className,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setUploading(true);
      const { url, error } = await uploadImage(file, folder);
      setUploading(false);
      if (error) {
        setError(error);
        return;
      }
      onChange(url);
    },
    [folder, onChange]
  );

  const aspectClass =
    aspect === 'square'
      ? 'aspect-square'
      : aspect === 'video'
      ? 'aspect-video'
      : 'aspect-[16/9]';

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </label>
      )}
      <div
        className={cn(
          'relative group rounded-lg overflow-hidden border border-border bg-background-soft',
          aspectClass
        )}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt="Upload preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
            <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-xs">No image selected</p>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          </div>
        )}

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-background/90 via-transparent to-transparent flex items-end justify-end gap-2 p-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-1.5 text-xs bg-primary text-primary-foreground px-2.5 py-1.5 rounded-md hover:bg-primary/90"
          >
            <Upload className="w-3 h-3" />
            {value ? 'Replace' : 'Upload'}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 text-xs bg-destructive text-destructive-foreground px-2.5 py-1.5 rounded-md hover:bg-destructive/90"
            >
              <X className="w-3 h-3" />
              Remove
            </button>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = '';
        }}
      />

      {value && (
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value || null)}
          className="w-full text-xs bg-background-soft border border-border rounded-md px-3 py-2 text-muted-foreground focus:text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Image URL"
        />
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
