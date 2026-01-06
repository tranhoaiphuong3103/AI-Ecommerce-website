'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface FlyToCartAnimationProps {
  imageUrl: string;
  startPosition: { x: number; y: number; width: number; height: number };
  onComplete: () => void;
}

export default function FlyToCartAnimation({
  imageUrl,
  startPosition,
  onComplete,
}: FlyToCartAnimationProps) {
  const [position, setPosition] = useState(startPosition);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const cartIcon = document.getElementById('nav-cart');
    if (!cartIcon) {
      onComplete();
      return;
    }

    const cartRect = cartIcon.getBoundingClientRect();
    const targetX = cartRect.left + cartRect.width / 2 - 25;
    const targetY = cartRect.top + cartRect.height / 2 - 25;

    requestAnimationFrame(() => {
      setIsAnimating(true);
      setPosition({
        x: targetX,
        y: targetY,
        width: 50,
        height: 50,
      });
    });

    const timer = setTimeout(() => {
      onComplete();
    }, 700);

    return () => clearTimeout(timer);
  }, [mounted, onComplete]);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: position.x,
        top: position.y,
        width: position.width,
        height: position.height,
        transition: isAnimating ? 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
      }}
    >
      <div
        className="w-full h-full rounded-lg overflow-hidden shadow-lg"
        style={{
          transform: isAnimating ? 'rotate(360deg)' : 'rotate(0deg)',
          transition: isAnimating ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
        }}
      >
        <img src={imageUrl} alt="Flying product" className="w-full h-full object-cover" />
      </div>
    </div>,
    document.body,
  );
}
