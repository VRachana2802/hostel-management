import React, { useState } from 'react'
import { Plus, FileText, Clock, CheckCircle, XCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { Modal } from '../../components/ui/Modal'
import { Badge } from '../../components/ui/Badge'
import { formatDate } from '../../lib/utils'

export function StudentOutpass() {
  const { user } = useAuth()
  const { outpasses, addOutpass } = useData()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    reason: '', destination: '',
    departure_date: '', departure_time: '',
    return_date: '', return_time: '',
  })
  const [success, setSuccess] = useState(false)

  const myOutpasses = outpasses.filter(o => o.student_id === user?.id)
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    addOutpass({
      student_id: user.id,
      student_name: user.name,
      ...form,
      status: 'pending',
      parent_verified: false,
    })
    setForm({ reason: '', destination: '', departure_date: '', departure_time: '', return_date: '', return_time: '' })
    setOpen(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  const stats = {
    total: myOutpasses.length,
    pending: myOutpasses.filter(o => o.status === 'pending').length,
    approved: myOutpasses.filter(o => o.status === 'approved').length,
    rejected: myOutpasses.filter(o => o.status === 'rejected').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Outpass Management</h1>
        <button onClick={() => setOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Apply Outpass
        </button>
      </div>

      {success && (
        <div className="p-3 rounded-lg flex items-center gap-2 text-sm text-emerald-300 animate-fade-in"
          style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <CheckCircle size={16} /> Outpass request submitted successfully! Pending warden approval.
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, icon: FileText, color: '#00d4ff' },
          { label: 'Pending', value: stats.pending, icon: Clock, color: '#f59e0b' },
          { label: 'Approved', value: stats.approved, icon: CheckCircle, color: '#10b981' },
          { label: 'Rejected', value: stats.rejected, icon: XCircle, color: '#ef4444' },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg flex-shrink-0" style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
              <s.icon size={16} style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-xl font-bold text-white" style={{ fontFamily: 'Orbitron' }}>{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <h3 className="section-title text-sm">My Outpass Requests</h3>
        </div>
        {myOutpasses.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <FileText size={40} className="mx-auto mb-3 opacity-30" />
            <p>No outpass requests yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Reason', 'Destination', 'Departure', 'Return', 'Status', 'Parent Verified'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs text-slate-500 uppercase tracking-wider font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {myOutpasses.map(op => (
                  <tr key={op.id} className="table-row">
                    <td className="px-5 py-3.5">
                      <p className="text-slate-200 font-medium">{op.reason}</p>
                      <p className="text-xs text-slate-500 mt-0.5">#{op.id.slice(-6).toUpperCase()}</p>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300">{op.destination}</td>
                    <td className="px-5 py-3.5 text-slate-400 font-mono text-xs">
                      {formatDate(op.departure_date)}<br />{op.departure_time}
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 font-mono text-xs">
                      {formatDate(op.return_date)}<br />{op.return_time}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={op.status as any}>{op.status}</Badge>
                      {op.warden_note && (
                        <p className="text-xs text-slate-500 mt-1 max-w-[200px] line-clamp-2">{op.warden_note}</p>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={op.parent_verified ? 'approved' : 'pending'}>
                        {op.parent_verified ? 'Verified' : 'Pending'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={open} onClose={() => setOpen(false)} title="Apply for Outpass" size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Reason for Outpass</label>
            <textarea className="input-field resize-none" rows={3} placeholder="Explain the reason..."
              value={form.reason} onChange={e => set('reason', e.target.value)} required />
          </div>
          <div>
            <label className="label">Destination</label>
            <input className="input-field" placeholder="Where are you going?"
              value={form.destination} onChange={e => set('destination', e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Departure Date</label>
              <input className="input-field" type="date" value={form.departure_date} onChange={e => set('departure_date', e.target.value)} required />
            </div>
            <div>
              <label className="label">Departure Time</label>
              <input className="input-field" type="time" value={form.departure_time} onChange={e => set('departure_time', e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Return Date</label>
              <input className="input-field" type="date" value={form.return_date} onChange={e => set('return_date', e.target.value)} required />
            </div>
            <div>
              <label className="label">Return Time</label>
              <input className="input-field" type="time" value={form.return_time} onChange={e => set('return_time', e.target.value)} required />
            </div>
          </div>
          <div className="p-3 rounded-lg text-xs text-slate-400" style={{ background: 'rgba(255,255,255,0.03)' }}>
            📧 A notification will be sent to your parent's email for verification upon submission.
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Submit Request</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
