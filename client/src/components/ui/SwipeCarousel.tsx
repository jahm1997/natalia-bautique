import React, { useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SwipeCarouselProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemWidth?: number;
  gap?: number;
  className?: string;
}

export default function SwipeCarousel<T>({ items, renderItem, itemWidth = 280, gap = 16, className = '' }: SwipeCarouselProps<T>) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const startX = useRef(0);
  const startOffset = useRef(0);
  const isDragging = useRef(false);

  const maxOffset = useCallback(() => {
    const total = items.length * (itemWidth + gap) - gap;
    const visible = trackRef.current?.parentElement?.clientWidth ?? itemWidth;
    return Math.max(0, total - visible);
  }, [items.length, itemWidth, gap]);

  const clamp = (val: number) => Math.max(-maxOffset(), Math.min(0, val));

  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startOffset.current = offset;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    setOffset(clamp(startOffset.current + (e.clientX - startX.current)));
  };

  const onPointerUp = () => { isDragging.current = false; };

  const scrollBy = (dir: 'left' | 'right') => {
    setOffset(prev => clamp(prev + (dir === 'left' ? itemWidth + gap : -(itemWidth + gap))));
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {offset < 0 && (
        <button onClick={() => scrollBy('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/70 border border-gold/30 rounded-full flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all shadow-xl">
          <ChevronLeft size={18} />
        </button>
      )}
      <div
        ref={trackRef}
        className="flex cursor-grab active:cursor-grabbing select-none"
        style={{ gap: `${gap}px`, transform: `translateX(${offset}px)`, transition: isDragging.current ? 'none' : 'transform 0.4s cubic-bezier(0.22,1,0.36,1)' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {items.map((item, index) => (
          <div key={index} style={{ minWidth: `${itemWidth}px`, width: `${itemWidth}px` }}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
      {-offset < maxOffset() && maxOffset() > 0 && (
        <button onClick={() => scrollBy('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/70 border border-gold/30 rounded-full flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all shadow-xl">
          <ChevronRight size={18} />
        </button>
      )}
    </div>
  );
}
