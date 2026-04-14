import React, { useState } from 'react'
import { CreditCard, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { Badge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { formatDate, formatCurrency } from '../../lib/utils'

export function StudentPayments() {
  const { user } = useAuth()
  const { payments, updatePayment } = useData()
  const [payingId, setPayingId] = useState<string | null>(null)
  const [payModal, setPayModal] = useState<string | null>(null)
  const [cardForm, setCardForm] = useState({ number: '', expiry: '', cvv: '', name: '' })
  const [paid, setPaid] = useState<string[]>([])

  const myPayments = payments.filter(p => p.student_id === user?.id)
  const totalPaid = myPayments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0)
  const totalPending = myPayments.filter(p => p.status !== 'paid').reduce((s, p) => s + p.amount, 0)

  const handlePay = async (id: string) => {
    setPayingId(id)
    await new Promise(r => setTimeout(r, 1500))
    updatePayment(id, { status: 'paid', paid_date: new Date().toISOString().split('T')[0] })
    setPaid(prev => [...prev, id])
    setPayingId(null)
    setPayModal(null)
  }

  const statusVariant = (s: string): 'approved' | 'pending' | 'rejected' => {
    if (s === 'paid') return 'approved'
    if (s === 'pending') return 'pending'
    return 'rejected'
  }

  const payment = payModal ? myPayments.find(p => p.id === payModal) : null

  return (
    <div className="space-y-6">
      <h1 className="page-title">Fee Payment</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <CheckCircle size={18} className="text-emerald-400 mb-3" />
          <p className="text-2xl font-bold text-white" style={{ fontFamily: 'Orbitron' }}>{formatCurrency(totalPaid)}</p>
          <p className="text-xs text-slate-500 mt-1">Total Paid</p>
        </div>
        <div className="glass-card p-5">
          <AlertCircle size={18} className="text-amber-400 mb-3" />
          <p className="text-2xl font-bold text-white" style={{ fontFamily: 'Orbitron' }}>{formatCurrency(totalPending)}</p>
          <p className="text-xs text-slate-500 mt-1">Pending</p>
        </div>
        <div className="glass-card p-5">
          <Clock size={18} className="text-cyan-400 mb-3" />
          <p className="text-2xl font-bold text-white" style={{ fontFamily: 'Orbitron' }}>{myPayments.length}</p>
          <p className="text-xs text-slate-500 mt-1">Total Records</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <h3 className="section-title text-sm">Payment History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Description', 'Amount', 'Due Date', 'Paid Date', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs text-slate-500 uppercase tracking-wider font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {myPayments.map(p => (
                <tr key={p.id} className="table-row">
                  <td className="px-5 py-3.5">
                    <p className="text-slate-200 font-medium">{p.description}</p>
                    <p className="text-xs text-slate-500 capitalize mt-0.5">{p.type.replace('_', ' ')}</p>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-slate-200">{formatCurrency(p.amount)}</td>
                  <td className="px-5 py-3.5 text-slate-400">{formatDate(p.due_date)}</td>
                  <td className="px-5 py-3.5 text-slate-400">{p.paid_date ? formatDate(p.paid_date) : '—'}</td>
                  <td className="px-5 py-3.5">
                    <Badge variant={statusVariant(p.status)}>{p.status}</Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    {p.status !== 'paid' && !paid.includes(p.id) && (
                      <button
                        onClick={() => setPayModal(p.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                        style={{ background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.25)', color: '#00d4ff' }}
                      >
                        <CreditCard size={12} /> Pay Now
                      </button>
                    )}
                    {paid.includes(p.id) && (
                      <span className="text-xs text-emerald-400 flex items-center gap-1">
                        <CheckCircle size={12} /> Paid
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pay Modal */}
      <Modal isOpen={!!payModal} onClose={() => setPayModal(null)} title="Complete Payment">
        {payment && (
          <div className="space-y-5">
            <div className="p-4 rounded-lg" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)' }}>
              <p className="text-sm text-slate-400">{payment.description}</p>
              <p className="text-2xl font-bold text-white mt-1" style={{ fontFamily: 'Orbitron' }}>{formatCurrency(payment.amount)}</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="label">Card Number</label>
                <input className="input-field font-mono" placeholder="1234 5678 9012 3456" maxLength={19}
                  value={cardForm.number}
                  onChange={e => setCardForm(f => ({ ...f, number: e.target.value.replace(/\D/g,'').replace(/(\d{4})/g,'$1 ').trim() }))} />
              </div>
              <div>
                <label className="label">Cardholder Name</label>
                <input className="input-field" placeholder="Name on card" value={cardForm.name}
                  onChange={e => setCardForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Expiry</label>
                  <input className="input-field font-mono" placeholder="MM/YY" maxLength={5} value={cardForm.expiry}
                    onChange={e => setCardForm(f => ({ ...f, expiry: e.target.value }))} />
                </div>
                <div>
                  <label className="label">CVV</label>
                  <input className="input-field font-mono" placeholder="123" maxLength={3} value={cardForm.cvv}
                    onChange={e => setCardForm(f => ({ ...f, cvv: e.target.value }))} />
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setPayModal(null)} className="btn-secondary flex-1">Cancel</button>
              <button
                onClick={() => handlePay(payment.id)}
                disabled={!!payingId}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {payingId === payment.id ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing…</>
                ) : (
                  <><CreditCard size={16} /> Pay {formatCurrency(payment.amount)}</>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
