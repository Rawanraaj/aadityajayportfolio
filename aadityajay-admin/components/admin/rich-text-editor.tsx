'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import { uploadImage } from '@/lib/upload';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Image as ImageIcon,
  Code,
  Undo2,
  Redo2,
  Loader2,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [uploading, setUploading] = useState(false);
  const lastValueRef = useRef(value);

  // Sync external value into the editor only when it changes externally
  // (e.g. loading an existing article). Avoids clobbering caret position
  // during normal typing.
  useEffect(() => {
    if (ref.current && value !== lastValueRef.current && value !== ref.current.innerHTML) {
      ref.current.innerHTML = value || '';
      lastValueRef.current = value;
    }
  }, [value]);

  const exec = useCallback((command: string, arg?: string) => {
    document.execCommand(command, false, arg);
    ref.current?.focus();
    if (ref.current) {
      lastValueRef.current = ref.current.innerHTML;
      onChange(ref.current.innerHTML);
    }
  }, [onChange]);

  const handleInput = useCallback(() => {
    if (ref.current) {
      lastValueRef.current = ref.current.innerHTML;
      onChange(ref.current.innerHTML);
    }
  }, [onChange]);

  const addLink = useCallback(() => {
    const url = window.prompt('Enter URL:');
    if (url) exec('createLink', url);
  }, [exec]);

  const addImage = useCallback(async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setUploading(true);
      const { url, error } = await uploadImage(file, 'article-body');
      setUploading(false);
      if (error) {
        alert('Upload failed: ' + error);
        return;
      }
      if (ref.current) {
        ref.current.focus();
        document.execCommand('insertImage', false, url);
        lastValueRef.current = ref.current.innerHTML;
        onChange(ref.current.innerHTML);
      }
    };
    input.click();
  }, [onChange]);

  const tools = [
    { icon: Bold, action: () => exec('bold'), label: 'Bold' },
    { icon: Italic, action: () => exec('italic'), label: 'Italic' },
    { icon: Heading2, action: () => exec('formatBlock', '<h2>'), label: 'Heading 2' },
    { icon: Heading3, action: () => exec('formatBlock', '<h3>'), label: 'Heading 3' },
    { icon: Quote, action: () => exec('formatBlock', '<blockquote>'), label: 'Quote' },
    { icon: List, action: () => exec('insertUnorderedList'), label: 'Bullet list' },
    { icon: ListOrdered, action: () => exec('insertOrderedList'), label: 'Numbered list' },
    { icon: LinkIcon, action: addLink, label: 'Link' },
    { icon: ImageIcon, action: addImage, label: 'Image', async: true },
    { icon: Code, action: () => exec('formatBlock', '<pre>'), label: 'Code block' },
    { icon: Undo2, action: () => exec('undo'), label: 'Undo' },
    { icon: Redo2, action: () => exec('redo'), label: 'Redo' },
  ];

  return (
    <div className="prose-editor rounded-lg border border-border bg-background-soft/50 overflow-hidden">
      <div className="flex items-center gap-0.5 flex-wrap border-b border-border bg-card/40 px-2 py-1.5 sticky top-0 z-10">
        {tools.map((t) => {
          const Icon = t.icon;
          return (
            <Button
              key={t.label}
              type="button"
              variant="ghost"
              size="icon"
              onClick={t.action}
              disabled={uploading && t.async}
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary"
              title={t.label}
            >
              {t.async && uploading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Icon className="w-3.5 h-3.5" />
              )}
            </Button>
          );
        })}
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onBlur={handleInput}
        data-placeholder={placeholder}
        className={cn(
          'px-4 py-4 text-sm leading-relaxed text-foreground min-h-[320px] focus:outline-none',
          'font-ui'
        )}
      />
    </div>
  );
}
