import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in MB
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  multiple = false,
  maxFiles = 5,
  maxSize = 5,
  className,
  placeholder = "Drag and drop images here, or click to select",
  disabled = false,
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentFiles = Array.isArray(value) ? value : (value ? [value] : []);

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`;
    }
    if (!file.type.startsWith('image/')) {
      return 'File must be an image';
    }
    return null;
  };

  const uploadFile = async (file: File): Promise<string> => {
    // Simulate upload to a service like Cloudinary, S3, etc.
    // For now, we'll use a data URL for demo purposes
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = useCallback(async (files: FileList) => {
    if (disabled) return;

    setError(null);
    const fileArray = Array.from(files);

    // Validate files
    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        setError(error);
        return;
      }
    }

    // Check file count limits
    if (multiple && currentFiles.length + fileArray.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    if (!multiple && fileArray.length > 1) {
      setError('Only one file allowed');
      return;
    }

    setIsUploading(true);

    try {
      const uploadPromises = fileArray.map(uploadFile);
      const uploadedUrls = await Promise.all(uploadPromises);

      if (multiple) {
        onChange([...currentFiles, ...uploadedUrls]);
      } else {
        onChange(uploadedUrls[0]);
      }
    } catch (error) {
      setError('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [currentFiles, disabled, maxFiles, multiple, onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [disabled, handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(files);
    }
  };

  const removeFile = (index: number) => {
    if (disabled) return;

    if (multiple) {
      const newFiles = currentFiles.filter((_, i) => i !== index);
      onChange(newFiles);
    } else {
      onChange('');
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer",
          isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          disabled ? "opacity-50 cursor-not-allowed" : "hover:border-primary hover:bg-primary/5",
          error ? "border-destructive" : ""
        )}
      >
        <div className="flex flex-col items-center justify-center text-center">
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
          ) : (
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
          )}

          <p className="text-sm text-muted-foreground mb-2">
            {isUploading ? 'Uploading...' : placeholder}
          </p>

          <p className="text-xs text-muted-foreground">
            Max {maxSize}MB • {multiple ? `Up to ${maxFiles} files` : 'Single file only'}
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {/* Preview Grid */}
      {currentFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentFiles.map((url, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square relative border rounded-lg overflow-hidden">
                <img
                  src={url}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {!disabled && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* File Count Info */}
      {multiple && currentFiles.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {currentFiles.length} of {maxFiles} files selected
        </p>
      )}
    </div>
  );
}