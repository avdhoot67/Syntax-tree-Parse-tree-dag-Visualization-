'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'blue' | 'purple' | 'emerald' | 'pink';
  hover?: boolean;
  delay?: number;
}

const glowColors = {
  blue: 'hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(0,212,255,0.08)]',
  purple: 'hover:border-purple-500/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.08)]',
  emerald: 'hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(52,211,153,0.08)]',
  pink: 'hover:border-pink-500/30 hover:shadow-[0_0_30px_rgba(244,114,182,0.08)]',
};

export default function GlowCard({
  children,
  className,
  glowColor = 'blue',
  hover = true,
  delay = 0,
}: GlowCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        'glass-card p-12 md:p-16 flex flex-col transition-all duration-500',
        hover && glowColors[glowColor],
        className
      )}
    >
      {children}
    </motion.div>
  );
}
