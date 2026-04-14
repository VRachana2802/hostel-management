import React, { useState } from 'react'
import { CheckCircle, XCircle, MessageSquare, Filter, RefreshCw } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { Badge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { formatDate, simulateEmailNotification, simulateOTP } from '../../lib/utils'
import type { Outpass } from '../../types'

export function WardenOutpass() {
  const { outpasses, updateOutpass, addNotification } = useData()
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [actionModal, setActionModal] = useState<{ op: Outpass; type: 'approve' | 'reject' } | null>(null)
  const [note, setNote] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [processing, setProcessing] = useState(false)

  const filtered = outpasses.filter(o => filter === 'all' ? true : o.status === filter)

  const openAction = (op: Outpass, type: 'approve' | 'reject') => {
    setActionModal({ op, type })
    setNote('')
    setOtpSent(false)
    setOtp('')
  }

  const sendOTP = () => {
    const code = simulateOTP()
    setGeneratedOtp(code)
    setOtpSent(true)
    console.log(`📱 OTP sent to parent: ${code}`)
    simulateEmailNotification(
      'parent@email.com',
      'Outpass Verification OTP',
      `Your OTP for outpass verification is: ${code}. Valid for 10 minutes.`
    )
  }

  const handleAction = async () => {
    if (!actionModal) return
    setProcessing(true)
    await new Promise(r => setTimeout(r, 800))
    
    const parentVerified = actionModal.type === 'approve' && otp === generatedOtp
    
    updateOutpass(actionModal.op.id, {
      status: actionModal.type === 'approve' ? 'approved' : 'rejected',
      warden_note: note || undefined,
      parent_verified: parentVerified,
    })
   addNotification({
  user_id: actionModal.op.student_id,
  title: `Outpass ${actionModal.type === 'approve' ? 'Approved' : 'Rejected'}`,
  message: `Your outpass request for ${actionModal.op.destination} has been ${actionModal.type === 'approve' ? 'approved' : 'rejected'}.${note ? ` Note: ${note}` : ''}`,
  type: actionModal.type === 'approve' ? 'success' : 'error',
  is_read: false,
  created_at: new Date().toISOString(),
})
    simulateEmailNotification(
      'student@hostel.com',
      `Outpass ${actionModal.type === 'approve' ? 'Approved' : 'Rejected'}`,
      `Your outpass has been ${actionModal.type === 'approve' ? 'approved' : 'rejected'}. ${note}`
    )
    setProcessing(false)
    setActionModal(null)
  }

  return (
    <div className="space-y-6">
      <h1 className="page-title">Outpass Management</h1>

      {/* Filter tabs */}
      <div className="glass-card p-1 flex gap-1 w-fit">
        {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize"
            style={filter === f ? {
              background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(168,85,247,0.2))',
              color: '#e2e8f0', border: '1px solid rgba(0,212,255,0.2)',
            } : { color: '#64748b' }}>
            {f} ({outpasses.filter(o => f === 'all' ? true : o.status === f).length})
          </button>
        ))}
      </div>

      <div className="glass-card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No {filter} outpass requests</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Student', 'Reason', 'Destination', 'Departure', 'Return', 'Parent', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(op => (
                  <tr key={op.id} className="table-row">
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-slate-200">{op.student_name}</p>
                    </td>
                    <td className="px-4 py-3.5 text-slate-400 max-w-[160px]">
                      <p className="truncate">{op.reason}</p>
                    </td>
                    <td className="px-4 py-3.5 text-slate-400">{op.destination}</td>
                    <td className="px-4 py-3.5 text-slate-400 text-xs font-mono">
                      {formatDate(op.departure_date)}<br />{op.departure_time}
                    </td>
                    <td className="px-4 py-3.5 text-slate-400 text-xs font-mono">
                      {formatDate(op.return_date)}<br />{op.return_time}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant={op.parent_verified ? 'approved' : 'pending'}>
                        {op.parent_verified ? 'Verified' : 'Pending'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant={op.status as any}>{op.status}</Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      {op.status === 'pending' && (
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => openAction(op, 'approve')}
                            className="p-1.5 rounded-lg transition-colors hover:bg-emerald-500/15 text-emerald-400">
                            <CheckCircle size={16} />
                          </button>
                          <button onClick={() => openAction(op, 'reject')}
                            className="p-1.5 rounded-lg transition-colors hover:bg-red-500/15 text-red-400">
                            <XCircle size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Action Modal */}
      <Modal
        isOpen={!!actionModal}
        onClose={() => setActionModal(null)}
        title={actionModal?.type === 'approve' ? 'Approve Outpass' : 'Reject Outpass'}
      >
        {actionModal && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-sm font-medium text-slate-200">{actionModal.op.student_name}</p>
              <p className="text-xs text-slate-400 mt-1">{actionModal.op.reason}</p>
              <p className="text-xs text-slate-500 mt-0.5">{actionModal.op.destination} · {formatDate(actionModal.op.departure_date)}</p>
            </div>

            {actionModal.type === 'approve' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Parent Verification via OTP</p>
                {!otpSent ? (
                  <button onClick={sendOTP} className="btn-secondary flex items-center gap-2 text-sm">
                    <MessageSquare size={14} /> Send OTP to Parent
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-emerald-400 mb-2">
                      <CheckCircle size={12} />
                      OTP sent! (Check console for code: <span className="font-mono font-bold">{generatedOtp}</span>)
                    </div>
                    <input className="input-field font-mono text-center tracking-[0.5em] text-lg"
                      placeholder="Enter OTP" maxLength={6} value={otp}
                      onChange={e => setOtp(e.target.value)} />
                    <button onClick={sendOTP} className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1">
                      <RefreshCw size={11} /> Resend OTP
                    </button>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="label">Note (Optional)</label>
              <textarea className="input-field resize-none" rows={2} placeholder="Add a note for the student..."
                value={note} onChange={e => setNote(e.target.value)} />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setActionModal(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleAction} disabled={processing}
                className={`flex-1 flex items-center justify-center gap-2 ${
                  actionModal.type === 'approve' ? 'btn-success' : 'btn-danger'
                }`}>
                {processing
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : actionModal.type === 'approve' ? <><CheckCircle size={14} /> Approve</> : <><XCircle size={14} /> Reject</>
                }
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
