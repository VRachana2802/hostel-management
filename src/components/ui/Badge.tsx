import React from 'react'
import { cn } from '../../lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'pending' | 'approved' | 'rejected' | 'resolved' | 'info'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-slate-700/50 text-slate-300 border-slate-600/50',
    pending: 'bg-amber-500/15 text-amber-300 border-amber-500/20',
    approved: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
    rejected: 'bg-red-500/15 text-red-300 border-red-500/20',
    resolved: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/20',
    info: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/20',
  }

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      variants[variant],
      className
    )}>
      {children}
    </span>
  )
}
