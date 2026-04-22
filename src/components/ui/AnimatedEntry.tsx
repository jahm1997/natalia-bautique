import React from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

type Direction = 'left' | 'right' | 'up' | 'down' | 'fade';

interface AnimatedEntryProps {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;
  className?: string;
  threshold?: number;
}

const transforms: Record<Direction, string> = {
  left: 'translateX(-60px)',
  right: 'translateX(60px)',
  up: 'translateY(40px)',
  down: 'translateY(-40px)',
  fade: 'translateY(0)',
};

export default function AnimatedEntry({ children, direction = 'up', delay = 0, className = '', threshold = 0.12 }: AnimatedEntryProps) {
  const { ref, isVisible } = useIntersectionObserver(threshold);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0) translateY(0)' : transforms[direction],
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
