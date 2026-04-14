import React, { useState } from 'react'
import { Plus, MessageSquare } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { Modal } from '../../components/ui/Modal'
import { Badge } from '../../components/ui/Badge'
import { formatDate, getPriorityColor } from '../../lib/utils'
import type { Complaint } from '../../types'

const CATEGORIES = ['maintenance', 'food', 'cleanliness', 'security', 'other']

export function StudentComplaints() {
  const { user } = useAuth()
  const { complaints, addComplaint } = useData()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ category: 'maintenance', description: '', priority: 'medium' })
  const [success, setSuccess] = useState(false)

  const myComplaints = complaints.filter(c => c.student_id === user?.id)
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    addComplaint({
      student_id: user.id,
      student_name: user.name,
      category: form.category as Complaint['category'],
      description: form.description,
      priority: form.priority as Complaint['priority'],
      status: 'open',
    })
    setForm({ category: 'maintenance', description: '', priority: 'medium' })
    setOpen(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  const statusMap: Record<string, 'pending' | 'rejected' | 'approved' | 'resolved'> = {
    open: 'rejected', in_progress: 'pending', resolved: 'resolved'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Complaints</h1>
        <button onClick={() => setOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> New Complaint
        </button>
      </div>

      {success && (
        <div className="p-3 rounded-lg text-sm text-emerald-300 animate-fade-in"
          style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
          ✓ Complaint submitted successfully!
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Open', count: myComplaints.filter(c => c.status === 'open').length, color: '#ef4444' },
          { label: 'In Progress', count: myComplaints.filter(c => c.status === 'in_progress').length, color: '#f59e0b' },
          { label: 'Resolved', count: myComplaints.filter(c => c.status === 'resolved').length, color: '#10b981' },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: s.color, fontFamily: 'Orbitron' }}>{s.count}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Complaints List */}
      <div className="space-y-3">
        {myComplaints.length === 0 ? (
          <div className="glass-card p-12 text-center text-slate-500">
            <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
            <p>No complaints submitted</p>
          </div>
        ) : myComplaints.map(c => (
          <div key={c.id} className="glass-card p-5 hover:border-white/10 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium uppercase tracking-wider px-2 py-0.5 rounded"
                  style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}>
                  {c.category}
                </span>
                <span className={`text-xs font-medium ${getPriorityColor(c.priority)}`}>
                  ● {c.priority} priority
                </span>
              </div>
              <Badge variant={statusMap[c.status] || 'pending'}>{c.status.replace('_', ' ')}</Badge>
            </div>
            <p className="text-sm text-slate-300 mb-2">{c.description}</p>
            {c.warden_note && (
              <div className="mt-2 p-2.5 rounded-lg text-xs text-slate-400"
                style={{ background: 'rgba(255,255,255,0.03)', borderLeft: '2px solid rgba(0,212,255,0.3)' }}>
                <span className="text-cyan-400 font-medium">Warden Note:</span> {c.warden_note}
              </div>
            )}
            <p className="text-xs text-slate-600 mt-3">Filed: {formatDate(c.created_at)}</p>
          </div>
        ))}
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="Submit Complaint">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Category</label>
            <select className="input-field" value={form.category} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c} className="bg-gray-900 capitalize">{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Priority</label>
            <select className="input-field" value={form.priority} onChange={e => set('priority', e.target.value)}>
              <option value="low" className="bg-gray-900">Low</option>
              <option value="medium" className="bg-gray-900">Medium</option>
              <option value="high" className="bg-gray-900">High</option>
            </select>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input-field resize-none" rows={4}
              placeholder="Describe your complaint in detail..."
              value={form.description} onChange={e => set('description', e.target.value)} required />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Submit</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
