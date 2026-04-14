import React, { useState } from 'react'
import { Home, Plus, Edit2, Users, Wrench, CheckCircle } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { Modal } from '../../components/ui/Modal'
import { Badge } from '../../components/ui/Badge'
import type { Room } from '../../types'
import { generateId } from '../../lib/utils'

const statusVariant = (s: string): any =>
  s === 'full' ? 'rejected' : s === 'available' ? 'approved' : 'pending'

const statusIcon = (s: string) =>
  s === 'full' ? <Users size={12} /> : s === 'available' ? <CheckCircle size={12} /> : <Wrench size={12} />

export function AdminRooms() {
  const { rooms, updateRoom } = useData()
  const [localRooms, setLocalRooms] = useState<Room[]>(rooms)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Room | null>(null)
  const [form, setForm] = useState({
    room_no: '', floor: '1', capacity: '2', type: 'double' as Room['type'], status: 'available' as Room['status']
  })
  const [filter, setFilter] = useState<Room['status'] | 'all'>('all')

  const filtered = localRooms.filter(r => filter === 'all' ? true : r.status === filter)

  const openAdd = () => {
    setEditing(null)
    setForm({ room_no: '', floor: '1', capacity: '2', type: 'double', status: 'available' })
    setOpen(true)
  }

  const openEdit = (r: Room) => {
    setEditing(r)
    setForm({ room_no: r.room_no, floor: String(r.floor), capacity: String(r.capacity), type: r.type, status: r.status })
    setOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const capacity = parseInt(form.capacity)
    if (editing) {
      const updated = { ...editing, ...form, floor: parseInt(form.floor), capacity }
      setLocalRooms(prev => prev.map(r => r.id === editing.id ? updated : r))
      updateRoom(editing.id, updated)
    } else {
      const newRoom: Room = {
        id: `room-${generateId()}`,
        room_no: form.room_no,
        floor: parseInt(form.floor),
        capacity,
        occupants: 0,
        type: form.type,
        status: form.status,
      }
      setLocalRooms(prev => [...prev, newRoom])
    }
    setOpen(false)
  }

  const stats = {
    available: localRooms.filter(r => r.status === 'available').length,
    full: localRooms.filter(r => r.status === 'full').length,
    maintenance: localRooms.filter(r => r.status === 'maintenance').length,
    totalCapacity: localRooms.reduce((s, r) => s + r.capacity, 0),
    totalOccupied: localRooms.reduce((s, r) => s + r.occupants, 0),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Room Management</h1>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Room
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Available', value: stats.available, color: '#10b981' },
          { label: 'Full', value: stats.full, color: '#ef4444' },
          { label: 'Maintenance', value: stats.maintenance, color: '#f59e0b' },
          { label: 'Occupancy Rate', value: `${Math.round((stats.totalOccupied / stats.totalCapacity) * 100)}%`, color: '#00d4ff' },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: s.color, fontFamily: 'Orbitron' }}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="glass-card p-1 flex gap-1 w-fit">
        {(['all', 'available', 'full', 'maintenance'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize"
            style={filter === f ? {
              background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(168,85,247,0.2))',
              color: '#e2e8f0', border: '1px solid rgba(0,212,255,0.2)',
            } : { color: '#64748b' }}>
            {f}
          </button>
        ))}
      </div>

      {/* Room Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(r => {
          const pct = Math.round((r.occupants / r.capacity) * 100)
          return (
            <div key={r.id} className="glass-card p-4 cursor-pointer glass-card-hover" onClick={() => openEdit(r)}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Home size={14} className="text-cyan-400" />
                  <span className="font-bold text-white" style={{ fontFamily: 'Orbitron', fontSize: '16px' }}>
                    {r.room_no}
                  </span>
                </div>
                <Badge variant={statusVariant(r.status)}>
                  <span className="flex items-center gap-1">{statusIcon(r.status)} {r.status}</span>
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 capitalize">{r.type} · Floor {r.floor}</span>
                  <span className="text-slate-300 font-medium">{r.occupants}/{r.capacity}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      background: pct === 100 ? '#ef4444' : pct > 60 ? '#f59e0b' : '#10b981'
                    }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} title={editing ? `Edit Room ${editing.room_no}` : 'Add New Room'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Room Number</label>
              <input className="input-field" placeholder="e.g. 301" value={form.room_no}
                onChange={e => setForm(f => ({ ...f, room_no: e.target.value }))} required />
            </div>
            <div>
              <label className="label">Floor</label>
              <input className="input-field" type="number" min="1" max="10" value={form.floor}
                onChange={e => setForm(f => ({ ...f, floor: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Capacity</label>
              <select className="input-field" value={form.capacity}
                onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))}>
                <option value="1" className="bg-gray-900">1 (Single)</option>
                <option value="2" className="bg-gray-900">2 (Double)</option>
                <option value="3" className="bg-gray-900">3 (Triple)</option>
                <option value="4" className="bg-gray-900">4 (Quad)</option>
              </select>
            </div>
            <div>
              <label className="label">Type</label>
              <select className="input-field" value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value as Room['type'] }))}>
                <option value="single" className="bg-gray-900">Single</option>
                <option value="double" className="bg-gray-900">Double</option>
                <option value="triple" className="bg-gray-900">Triple</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Status</label>
            <select className="input-field" value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value as Room['status'] }))}>
              <option value="available" className="bg-gray-900">Available</option>
              <option value="full" className="bg-gray-900">Full</option>
              <option value="maintenance" className="bg-gray-900">Maintenance</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">{editing ? 'Update Room' : 'Add Room'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
