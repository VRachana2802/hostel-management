import React, { useState } from 'react'
import { CheckCircle, Clock, MessageSquare } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { Badge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { formatDate, getPriorityColor } from '../../lib/utils'
import type { Complaint } from '../../types'

export function WardenComplaints() {
  const { complaints, updateComplaint, addNotification } = useData()
  const [selected, setSelected] = useState<Complaint | null>(null)
  const [note, setNote] = useState('')
  const [processing, setProcessing] = useState(false)

  const updateStatus = async (status: Complaint['status']) => {
    if (!selected) return
    setProcessing(true)
    await new Promise(r => setTimeout(r, 600))
    updateComplaint(selected.id, {
      status,
      warden_note: note || undefined,
      resolved_at: status === 'resolved' ? new Date().toISOString() : undefined,
    })
    addNotification({
  user_id: selected.student_id,
  title: 'Complaint Update',
  message: `Your complaint has been marked as "${status}".${note ? ` Note: ${note}` : ''}`,
  type: status === 'resolved' ? 'success' : 'info',
  is_read: false,
  created_at: new Date().toISOString(),
})
    setProcessing(false)
    setSelected(null)
    setNote('')
  }

  const statusVariant = (s: string) =>
    s === 'open' ? 'rejected' : s === 'resolved' ? 'resolved' : 'pending'

  return (
    <div className="space-y-6">
      <h1 className="page-title">Complaints Management</h1>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Open', count: complaints.filter(c => c.status === 'open').length, color: '#ef4444' },
          { label: 'In Progress', count: complaints.filter(c => c.status === 'in_progress').length, color: '#f59e0b' },
          { label: 'Resolved', count: complaints.filter(c => c.status === 'resolved').length, color: '#10b981' },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className="text-3xl font-bold" style={{ color: s.color, fontFamily: 'Orbitron' }}>{s.count}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {complaints.map(c => (
          <div key={c.id} className="glass-card p-5 cursor-pointer hover:border-white/12 transition-all"
            onClick={() => { setSelected(c); setNote(c.warden_note || '') }}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-slate-200">{c.student_name}</span>
                <span className="text-xs text-slate-500">Room {c.room_no}</span>
                <span className={`text-xs font-medium ${getPriorityColor(c.priority)}`}>● {c.priority}</span>
                <span className="text-xs px-2 py-0.5 rounded capitalize"
                  style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}>{c.category}</span>
              </div>
              <Badge variant={statusVariant(c.status) as any}>{c.status.replace('_', ' ')}</Badge>
            </div>
            <p className="text-sm text-slate-400">{c.description}</p>
            <p className="text-xs text-slate-600 mt-2">{formatDate(c.created_at)}</p>
          </div>
        ))}
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Manage Complaint" size="md">
        {selected && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-slate-200">{selected.student_name}</span>
                <span className={`text-xs ${getPriorityColor(selected.priority)}`}>● {selected.priority}</span>
              </div>
              <p className="text-sm text-slate-400">{selected.description}</p>
            </div>
            <div>
              <label className="label">Warden Note / Resolution</label>
              <textarea className="input-field resize-none" rows={3}
                placeholder="Add note or resolution details..."
                value={note} onChange={e => setNote(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <button onClick={() => updateStatus('in_progress')} disabled={processing}
                className="flex-1 btn-secondary flex items-center justify-center gap-2 text-sm">
                <Clock size={14} /> In Progress
              </button>
              <button onClick={() => updateStatus('resolved')} disabled={processing}
                className="flex-1 btn-success flex items-center justify-center gap-2 text-sm">
                {processing
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><CheckCircle size={14} /> Resolve</>
                }
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
