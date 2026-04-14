import React, { useState } from 'react'
import { QrCode, LogIn, LogOut, Clock, Smartphone, CheckCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { formatTime } from '../../lib/utils'

export function StudentEntryExit() {
  const { user } = useAuth()
  const { entryLogs, addEntryLog } = useData()
  const [scanning, setScanning] = useState(false)
  const [lastAction, setLastAction] = useState<'check_in' | 'check_out' | null>(null)

  const myLogs = entryLogs.filter(l => l.student_id === user?.id)

  const simulateScan = async (type: 'check_in' | 'check_out') => {
    setScanning(true)
    await new Promise(r => setTimeout(r, 2000))
    if (!user) return
    addEntryLog({
      student_id: user.id,
      student_name: user.name,
      type,
      method: 'qr',
      timestamp: new Date().toISOString(),
    })
    setLastAction(type)
    setScanning(false)
    setTimeout(() => setLastAction(null), 4000)
  }

  // QR Pattern SVG
  const QRPattern = () => (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <rect width="200" height="200" fill="transparent"/>
      {/* Corner squares */}
      {[[10,10],[130,10],[10,130]].map(([x,y], i) => (
        <g key={i}>
          <rect x={x} y={y} width="60" height="60" rx="4" fill="none" stroke="rgba(0,212,255,0.6)" strokeWidth="3"/>
          <rect x={x+10} y={y+10} width="40" height="40" rx="2" fill="rgba(0,212,255,0.15)"/>
          <rect x={x+18} y={y+18} width="24" height="24" rx="1" fill="rgba(0,212,255,0.6)"/>
        </g>
      ))}
      {/* Data dots */}
      {Array.from({length: 8}, (_,row) =>
        Array.from({length: 8}, (_,col) => {
          const x = 80 + col*10
          const y = 80 + row*10
          if (Math.random() > 0.45) return (
            <rect key={`${row}-${col}`} x={x} y={y} width="8" height="8" rx="1"
              fill={`rgba(0,212,255,${0.3 + Math.random()*0.5})`}/>
          )
          return null
        })
      )}
      {Array.from({length:5}, (_,i) =>
        Array.from({length:3}, (_,j) => (
          <rect key={`m-${i}-${j}`} x={80+j*10} y={10+i*10} width="8" height="8" rx="1"
            fill={Math.random() > 0.5 ? 'rgba(0,212,255,0.5)' : 'transparent'}/>
        ))
      )}
      {Array.from({length:3}, (_,i) =>
        Array.from({length:5}, (_,j) => (
          <rect key={`n-${i}-${j}`} x={10+j*10} y={80+i*10} width="8" height="8" rx="1"
            fill={Math.random() > 0.5 ? 'rgba(0,212,255,0.5)' : 'transparent'}/>
        ))
      )}
    </svg>
  )

  return (
    <div className="space-y-6">
      <h1 className="page-title">Entry / Exit Logging</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* QR Scanner */}
        <div className="glass-card p-6 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-6 self-start">
            <QrCode size={18} className="text-cyan-400" />
            <h3 className="section-title text-sm">QR Code Scanner</h3>
          </div>

          {/* QR Display */}
          <div className="relative w-48 h-48 mb-6">
            <div className="w-full h-full p-3 rounded-xl"
              style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.2)' }}>
              <QRPattern />
            </div>
            {scanning && (
              <div className="absolute inset-0 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.7)' }}>
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"/>
                  <p className="text-xs text-cyan-400">Scanning…</p>
                </div>
                {/* Scan line animation */}
                <div className="absolute inset-x-2 h-0.5 rounded"
                  style={{ background: 'rgba(0,212,255,0.8)', animation: 'scanLine 1.5s linear infinite', top: '30%' }}/>
              </div>
            )}
            {lastAction && !scanning && (
              <div className="absolute inset-0 rounded-xl flex items-center justify-center animate-fade-in"
                style={{ background: 'rgba(16,185,129,0.15)' }}>
                <div className="text-center">
                  <CheckCircle size={36} className="text-emerald-400 mx-auto mb-1"/>
                  <p className="text-xs text-emerald-400 font-medium">
                    {lastAction === 'check_in' ? 'Checked In!' : 'Checked Out!'}
                  </p>
                </div>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-500 mb-5 text-center font-mono">
            Student ID: {user?.roll_number || user?.id?.slice(0,8).toUpperCase()}
          </p>

          <div className="flex gap-3 w-full">
            <button
              onClick={() => simulateScan('check_in')}
              disabled={scanning}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all"
              style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#6ee7b7' }}
            >
              <LogIn size={16} /> Check In
            </button>
            <button
              onClick={() => simulateScan('check_out')}
              disabled={scanning}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all"
              style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}
            >
              <LogOut size={16} /> Check Out
            </button>
          </div>

          <p className="text-xs text-slate-600 mt-4 text-center">
            Present QR code at the gate scanner or use buttons above to simulate
          </p>
        </div>

        {/* Entry Log History */}
        <div className="glass-card overflow-hidden">
          <div className="p-5 border-b flex items-center gap-2" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <Clock size={16} className="text-purple-400" />
            <h3 className="section-title text-sm">Entry/Exit History</h3>
          </div>
          <div className="divide-y" style={{ '--tw-divide-opacity': 1 } as any}>
            {myLogs.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">No logs yet</div>
            ) : (
              myLogs.slice(0, 10).map(log => (
                <div key={log.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-white/02 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      log.type === 'check_in' ? 'bg-emerald-500/15' : 'bg-red-500/15'
                    }`}>
                      {log.type === 'check_in'
                        ? <LogIn size={14} className="text-emerald-400" />
                        : <LogOut size={14} className="text-red-400" />
                      }
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200 capitalize">{log.type.replace('_', ' ')}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Smartphone size={10} />
                        via {log.method.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">{formatTime(log.timestamp)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scanLine {
          0% { top: 10%; }
          50% { top: 80%; }
          100% { top: 10%; }
        }
      `}</style>
    </div>
  )
}
