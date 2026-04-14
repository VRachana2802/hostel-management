import React from 'react'
import { cn } from '../../lib/utils'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  color?: 'blue' | 'purple' | 'green' | 'yellow' | 'red' | 'pink'
  trend?: { value: number; label: string }
  className?: string
}

const colorConfig = {
  blue: {
    icon: 'text-cyan-400',
    bg: 'rgba(0,212,255,0.08)',
    border: 'rgba(0,212,255,0.15)',
    glow: 'rgba(0,212,255,0.05)',
    bar: '#00d4ff',
  },
  purple: {
    icon: 'text-purple-400',
    bg: 'rgba(168,85,247,0.08)',
    border: 'rgba(168,85,247,0.15)',
    glow: 'rgba(168,85,247,0.05)',
    bar: '#a855f7',
  },
  green: {
    icon: 'text-emerald-400',
    bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.15)',
    glow: 'rgba(16,185,129,0.05)',
    bar: '#10b981',
  },
  yellow: {
    icon: 'text-amber-400',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.15)',
    glow: 'rgba(245,158,11,0.05)',
    bar: '#f59e0b',
  },
  red: {
    icon: 'text-red-400',
    bg: 'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.15)',
    glow: 'rgba(239,68,68,0.05)',
    bar: '#ef4444',
  },
  pink: {
    icon: 'text-pink-400',
    bg: 'rgba(236,72,153,0.08)',
    border: 'rgba(236,72,153,0.15)',
    glow: 'rgba(236,72,153,0.05)',
    bar: '#ec4899',
  },
}

export function StatCard({ title, value, subtitle, icon: Icon, color = 'blue', trend, className }: StatCardProps) {
  const cfg = colorConfig[color]

  return (
    <div
      className={cn('glass-card p-5 relative overflow-hidden cursor-default transition-all duration-300 hover:-translate-y-1', className)}
      style={{ boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 30px ${cfg.glow}` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="p-2.5 rounded-lg"
          style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
        >
          <Icon size={20} className={cfg.icon} />
        </div>
        {trend && (
          <span className={cn(
            'text-xs font-medium px-2 py-0.5 rounded-full',
            trend.value >= 0
              ? 'text-emerald-400 bg-emerald-400/10'
              : 'text-red-400 bg-red-400/10'
          )}>
            {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          {value}
        </p>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {/* decorative bar */}
      <div
        className="absolute bottom-0 left-0 h-0.5 w-full opacity-60"
        style={{ background: `linear-gradient(90deg, ${cfg.bar}, transparent)` }}
      />
    </div>
  )
}
