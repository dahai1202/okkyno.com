import { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function LazyImage({ 
  src, 
  alt, 
  className, 
  placeholder = '/placeholder-product.svg',
  onLoad,
  onError 
}: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
    
    // Try to reload the image with different parameters if it's an Unsplash URL
    if (imgRef.current && src.includes('unsplash.com') && !hasError) {
      const newSrc = src.includes('?') ? `${src}&retry=1` : `${src}?retry=1`;
      imgRef.current.src = newSrc;
    }
  }, [onError, src, hasError]);

  // Intersection Observer for lazy loading
  const observerRef = useCallback((node: HTMLDivElement) => {
    if (node) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isInView) {
            setIsInView(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(node);
    }
  }, [isInView]);

  return (
    <div ref={observerRef} className={cn("relative overflow-hidden", className)}>
      {isInView && (
        <img
          ref={imgRef}
          src={hasError ? placeholder : (src || placeholder)}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          loading="lazy"
          decoding="async"
          crossOrigin="anonymous"
        />
      )}
      
      {(isLoading || !isInView) && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}