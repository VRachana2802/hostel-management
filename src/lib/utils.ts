import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'approved':
    case 'paid':
    case 'present':
    case 'resolved':
      return 'status-approved'
    case 'pending':
    case 'in_progress':
    case 'booked':
      return 'status-pending'
    case 'rejected':
    case 'overdue':
    case 'absent':
    case 'open':
      return 'status-rejected'
    default:
      return 'status-pending'
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'high':
      return 'text-red-400'
    case 'medium':
      return 'text-yellow-400'
    case 'low':
      return 'text-green-400'
    default:
      return 'text-slate-400'
  }
}

export function simulateEmailNotification(to: string, subject: string, body: string): void {
  console.log('📧 EMAIL NOTIFICATION SIMULATED:')
  console.log(`  To: ${to}`)
  console.log(`  Subject: ${subject}`)
  console.log(`  Body: ${body}`)
}

export function simulateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}
