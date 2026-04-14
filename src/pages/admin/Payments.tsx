import React, { useState } from 'react'
import { CreditCard, Plus, Search, Download } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { Modal } from '../../components/ui/Modal'
import { Badge } from '../../components/ui/Badge'
import { formatDate, formatCurrency } from '../../lib/utils'
import { mockUsers } from '../../lib/mockData'
import type { Payment } from '../../types'
import { generateId } from '../../lib/utils'

export function AdminPayments() {
  const { payments, addPayment, updatePayment } = useData()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Payment['status'] | 'all'>('all')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    student_id: '', type: 'hostel_fee' as Payment['type'],
    amount: '', due_date: '', description: '',
  })

  const students = mockUsers.filter(u => u.role === 'student')

  const filtered = payments.filter(p => {
    const matchStatus = filter === 'all' || p.status === filter
    const matchSearch = !search ||
      p.student_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const totals = {
    collected: payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0),
    pending: payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0),
    overdue: payments.filter(p => p.status === 'overdue').reduce((s, p) => s + p.amount, 0),
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const student = students.find(s => s.id === form.student_id)
    addPayment({
      student_id: form.student_id,
      student_name: student?.name,
      type: form.type,
      amount: parseFloat(form.amount),
      due_date: form.due_date,
      description: form.description,
      status: 'pending',
    })
    setForm({ student_id: '', type: 'hostel_fee', amount: '', due_date: '', description: '' })
    setOpen(false)
  }

  const statusVariant = (s: string): any => {
    if (s === 'paid') return 'approved'
    if (s === 'overdue') return 'rejected'
    return 'pending'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Fee Management</h1>
        <button onClick={() => setOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Record
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Collected', amount: totals.collected, color: '#10b981' },
          { label: 'Pending', amount: totals.pending, color: '#f59e0b' },
          { label: 'Overdue', amount: totals.overdue, color: '#ef4444' },
        ].map(s => (
          <div key={s.label} className="glass-card p-5">
            <CreditCard size={18} className="mb-3" style={{ color: s.color }} />
            <p className="text-xl font-bold text-white" style={{ fontFamily: 'Orbitron' }}>
              {formatCurrency(s.amount)}
            </p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1 min-w-[200px]"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Search size={14} className="text-slate-500" />
          <input className="bg-transparent text-sm text-slate-200 outline-none flex-1 placeholder-slate-600"
            placeholder="Search payments…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="glass-card p-1 flex gap-1">
          {(['all', 'paid', 'pending', 'overdue'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize"
              style={filter === f ? {
                background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(168,85,247,0.2))',
                color: '#e2e8f0',
              } : { color: '#64748b' }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Student', 'Type', 'Amount', 'Due Date', 'Paid Date', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs text-slate-500 uppercase tracking-wider font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="table-row">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-slate-200">{p.student_name}</p>
                    <p className="text-xs text-slate-500">{p.description}</p>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 capitalize text-xs">
                    {p.type.replace('_', ' ')}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-slate-200">{formatCurrency(p.amount)}</td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs">{formatDate(p.due_date)}</td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs">{p.paid_date ? formatDate(p.paid_date) : '—'}</td>
                  <td className="px-5 py-3.5">
                    <Badge variant={statusVariant(p.status)}>{p.status}</Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    {p.status !== 'paid' && (
                      <button
                        onClick={() => updatePayment(p.id, { status: 'paid', paid_date: new Date().toISOString().split('T')[0] })}
                        className="text-xs px-2.5 py-1 rounded-lg transition-all"
                        style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#6ee7b7' }}
                      >
                        Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="Add Payment Record">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Student</label>
            <select className="input-field" value={form.student_id}
              onChange={e => setForm(f => ({ ...f, student_id: e.target.value }))} required>
              <option value="" className="bg-gray-900">Select student</option>
              {students.map(s => (
                <option key={s.id} value={s.id} className="bg-gray-900">{s.name} ({s.roll_number})</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Payment Type</label>
              <select className="input-field" value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value as Payment['type'] }))}>
                <option value="hostel_fee" className="bg-gray-900">Hostel Fee</option>
                <option value="mess_fee" className="bg-gray-900">Mess Fee</option>
                <option value="maintenance" className="bg-gray-900">Maintenance</option>
                <option value="other" className="bg-gray-900">Other</option>
              </select>
            </div>
            <div>
              <label className="label">Amount (₹)</label>
              <input className="input-field" type="number" placeholder="Amount" value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required />
            </div>
          </div>
          <div>
            <label className="label">Due Date</label>
            <input className="input-field" type="date" value={form.due_date}
              onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Description</label>
            <input className="input-field" placeholder="e.g. Hostel Fee - March 2024" value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Add Record</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
