import React, { useState } from 'react'
import { Users, Plus, Search, Edit2, Trash2, Phone, Mail } from 'lucide-react'
import { Modal } from '../../components/ui/Modal'
import { Badge } from '../../components/ui/Badge'
import { mockUsers, mockRooms } from '../../lib/mockData'
import type { User, UserRole } from '../../types'
import { generateId } from '../../lib/utils'

export function AdminStudents() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)
  const [form, setForm] = useState({
    name: '', email: '', role: 'student' as UserRole,
    roll_number: '', phone: '', parent_phone: '', parent_email: '', room_id: '',
  })

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.roll_number?.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => {
    setEditing(null)
    setForm({ name: '', email: '', role: 'student', roll_number: '', phone: '', parent_phone: '', parent_email: '', room_id: '' })
    setOpen(true)
  }

  const openEdit = (u: User) => {
    setEditing(u)
    setForm({
      name: u.name, email: u.email, role: u.role,
      roll_number: u.roll_number || '', phone: u.phone || '',
      parent_phone: u.parent_phone || '', parent_email: u.parent_email || '',
      room_id: u.room_id || '',
    })
    setOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) {
      setUsers(prev => prev.map(u => u.id === editing.id ? {
        ...u, ...form, avatar: form.name.split(' ').map(n => n[0]).join('').toUpperCase()
      } : u))
    } else {
      const newUser: User = {
        id: `user-${generateId()}`,
        avatar: form.name.split(' ').map(n => n[0]).join('').toUpperCase(),
        created_at: new Date().toISOString(),
        ...form,
      }
      setUsers(prev => [...prev, newUser])
    }
    setOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this user?')) setUsers(prev => prev.filter(u => u.id !== id))
  }

  const roleColors: Record<string, string> = {
    student: '#00d4ff', warden: '#a855f7', admin: '#10b981'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="page-title">User Management</h1>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add User
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {(['student', 'warden', 'admin'] as const).map(role => (
          <div key={role} className="glass-card p-4 text-center">
            <p className="text-2xl font-bold capitalize" style={{ color: roleColors[role], fontFamily: 'Orbitron' }}>
              {users.filter(u => u.role === role).length}
            </p>
            <p className="text-xs text-slate-500 mt-1 capitalize">{role}s</p>
          </div>
        ))}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b flex items-center gap-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Search size={14} className="text-slate-500" />
            <input className="bg-transparent text-sm text-slate-200 outline-none flex-1 placeholder-slate-600"
              placeholder="Search by name, email or roll number…"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['User', 'Roll No', 'Role', 'Phone', 'Room', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs text-slate-500 uppercase tracking-wider font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="table-row">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: `${roleColors[u.role]}18`, color: roleColors[u.role], border: `1px solid ${roleColors[u.role]}28` }}>
                        {u.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-slate-200">{u.name}</p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 font-mono text-xs">{u.roll_number || '—'}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs px-2 py-0.5 rounded-full capitalize"
                      style={{ background: `${roleColors[u.role]}15`, color: roleColors[u.role], border: `1px solid ${roleColors[u.role]}25` }}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs">{u.phone || '—'}</td>
                  <td className="px-5 py-3.5">
                    {u.room_id ? (
                      <span className="text-xs text-cyan-400 font-mono">
                        {mockRooms.find(r => r.id === u.room_id)?.room_no || u.room_id}
                      </span>
                    ) : <span className="text-slate-600">—</span>}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => openEdit(u)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10 transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(u.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} title={editing ? 'Edit User' : 'Add New User'} size="md">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Full Name</label>
              <input className="input-field" placeholder="Full name" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input-field" type="email" placeholder="Email" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Role</label>
              <select className="input-field" value={form.role}
                onChange={e => setForm(f => ({ ...f, role: e.target.value as UserRole }))}>
                <option value="student" className="bg-gray-900">Student</option>
                <option value="warden" className="bg-gray-900">Warden</option>
                <option value="admin" className="bg-gray-900">Admin</option>
              </select>
            </div>
            <div>
              <label className="label">Roll Number</label>
              <input className="input-field" placeholder="e.g. CS2021001" value={form.roll_number}
                onChange={e => setForm(f => ({ ...f, roll_number: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Phone</label>
              <input className="input-field" placeholder="Mobile number" value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <div>
              <label className="label">Room</label>
              <select className="input-field" value={form.room_id}
                onChange={e => setForm(f => ({ ...f, room_id: e.target.value }))}>
                <option value="" className="bg-gray-900">No room</option>
                {mockRooms.map(r => (
                  <option key={r.id} value={r.id} className="bg-gray-900">Room {r.room_no} ({r.type})</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Parent Phone</label>
              <input className="input-field" placeholder="Parent mobile" value={form.parent_phone}
                onChange={e => setForm(f => ({ ...f, parent_phone: e.target.value }))} />
            </div>
            <div>
              <label className="label">Parent Email</label>
              <input className="input-field" type="email" placeholder="Parent email" value={form.parent_email}
                onChange={e => setForm(f => ({ ...f, parent_email: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">{editing ? 'Update' : 'Add User'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
