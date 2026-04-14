import React, { useState } from 'react'
import { DoorOpen, LogIn, LogOut, Smartphone, Search } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { formatTime, formatDate } from '../../lib/utils'

export function WardenEntryLogs() {
  const { entryLogs } = useData()
  const [search, setSearch] = useState('')

  const filtered = entryLogs.filter(l =>
    !search || l.student_name?.toLowerCase().includes(search.toLowerCase())
  )

  const checkIns = entryLogs.filter(l => {
    const today = new Date().toISOString().split('T')[0]
    return l.type === 'check_in' && l.timestamp.startsWith(today)
  })
  const checkOuts = entryLogs.filter(l => {
    const today = new Date().toISOString().split('T')[0]
    return l.type === 'check_out' && l.timestamp.startsWith(today)
  })

  return (
    <div className="space-y-6">
      <h1 className="page-title">Entry / Exit Logs</h1>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Today's Check-ins", value: checkIns.length, color: '#10b981' },
          { label: "Today's Check-outs", value: checkOuts.length, color: '#ef4444' },
          { label: 'Total Logs', value: entryLogs.length, color: '#00d4ff' },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className="text-3xl font-bold" style={{ color: s.color, fontFamily: 'Orbitron' }}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b flex items-center gap-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Search size={14} className="text-slate-500" />
            <input className="bg-transparent text-sm text-slate-200 outline-none flex-1 placeholder-slate-600"
              placeholder="Search student…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Student', 'Type', 'Method', 'Time', 'Date'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(log => (
                <tr key={log.id} className="table-row">
                  <td className="px-5 py-3.5 font-medium text-slate-200">{log.student_name}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      {log.type === 'check_in'
                        ? <LogIn size={14} className="text-emerald-400" />
                        : <LogOut size={14} className="text-red-400" />
                      }
                      <span className={`text-sm capitalize ${log.type === 'check_in' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {log.type.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                      <Smartphone size={12} /> {log.method.toUpperCase()}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 font-mono text-xs">{formatTime(log.timestamp)}</td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs">{formatDate(log.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
