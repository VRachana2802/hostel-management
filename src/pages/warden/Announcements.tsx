import React, { useState } from 'react'
import { Megaphone, Plus, AlertCircle, Bell } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { Modal } from '../../components/ui/Modal'
import { formatDate } from '../../lib/utils'

export function WardenAnnouncements() {
  const { user } = useAuth()
  const { announcements, addAnnouncement } = useData()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', is_urgent: false, target_role: 'all' as any })
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    addAnnouncement({ ...form, author: user.name, created_at: new Date().toISOString() })
    setForm({ title: '', content: '', is_urgent: false, target_role: 'all' })
    setOpen(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Announcements</h1>
        <button onClick={() => setOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> New Announcement
        </button>
      </div>

      {success && (
        <div className="p-3 rounded-lg text-sm text-emerald-300 animate-fade-in"
          style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
          ✓ Announcement published to all students!
        </div>
      )}

      <div className="space-y-3">
        {announcements.map(ann => (
          <div key={ann.id} className="glass-card p-5"
            style={ann.is_urgent ? { borderColor: 'rgba(245,158,11,0.25)' } : {}}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {ann.is_urgent
                  ? <AlertCircle size={16} className="text-amber-400 flex-shrink-0" />
                  : <Bell size={16} className="text-slate-500 flex-shrink-0" />
                }
                <h4 className="font-medium text-slate-200">{ann.title}</h4>
                {ann.is_urgent && (
                  <span className="text-xs px-2 py-0.5 rounded-full text-amber-300"
                    style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    URGENT
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-600 flex-shrink-0">{formatDate(ann.created_at)}</span>
            </div>
            <p className="text-sm text-slate-400">{ann.content}</p>
            <div className="flex items-center gap-3 mt-3 text-xs text-slate-600">
              <span>By {ann.author}</span>
              <span>→ {ann.target_role === 'all' ? 'Everyone' : ann.target_role}</span>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="New Announcement">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Title</label>
            <input className="input-field" placeholder="Announcement title"
              value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Content</label>
            <textarea className="input-field resize-none" rows={4}
              placeholder="Write your announcement..."
              value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Target</label>
            <select className="input-field" value={form.target_role}
              onChange={e => setForm(f => ({ ...f, target_role: e.target.value as any }))}>
              <option value="all" className="bg-gray-900">Everyone</option>
              <option value="student" className="bg-gray-900">Students Only</option>
              <option value="warden" className="bg-gray-900">Wardens Only</option>
            </select>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.03)' }}
            onClick={() => setForm(f => ({ ...f, is_urgent: !f.is_urgent }))}>
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${form.is_urgent ? 'border-amber-400 bg-amber-400' : 'border-slate-600'}`}>
              {form.is_urgent && <span className="text-black text-xs">✓</span>}
            </div>
            <span className="text-sm text-slate-300">Mark as urgent</span>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
              <Megaphone size={14} /> Publish
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
