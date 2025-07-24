"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function CursorTracker() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30 transition duration-300"
      style={{
        background: `radial-gradient(400px at ${mousePosition.x}px ${mousePosition.y}px, hsl(var(--primary) / 0.1), transparent 80%)`,
      }}
    />
  );
}
