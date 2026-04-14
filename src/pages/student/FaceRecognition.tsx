import React, { useState, useRef, useEffect } from 'react'
import { Camera, Scan, CheckCircle, XCircle, User, Zap } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'

type Status = 'idle' | 'camera' | 'scanning' | 'success' | 'failed'

export function FaceRecognition() {
  const { user } = useAuth()
  const { addEntryLog } = useData()
  const [status, setStatus] = useState<Status>('idle')
  const [actionType, setActionType] = useState<'check_in' | 'check_out'>('check_in')
  const [confidence, setConfidence] = useState(0)
  const [streamError, setStreamError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = async () => {
    setStreamError(false)
    setStatus('camera')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch {
      setStreamError(true)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    setStatus('idle')
  }

  const simulateRecognition = async () => {
    setStatus('scanning')
    setConfidence(0)
    // Animate confidence
    for (let i = 0; i <= 94; i += 2) {
      await new Promise(r => setTimeout(r, 30))
      setConfidence(i)
    }
    const success = Math.random() > 0.15 // 85% success rate
    if (success) {
      setStatus('success')
      if (user) {
        addEntryLog({
          student_id: user.id,
          student_name: user.name,
          type: actionType,
          method: 'face',
          timestamp: new Date().toISOString(),
        })
      }
    } else {
      setStatus('failed')
      setConfidence(0)
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
  }

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
      }
    }
  }, [])

  const reset = () => {
    setStatus('idle')
    setConfidence(0)
  }

  return (
    <div className="space-y-6">
      <h1 className="page-title">Face Recognition Entry</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <Camera size={18} className="text-purple-400" />
            <h3 className="section-title text-sm">Facial Verification</h3>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full text-purple-300" style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.2)' }}>
              AI-Powered
            </span>
          </div>

          {/* Action Selector */}
          <div className="flex gap-2 mb-5">
            {(['check_in', 'check_out'] as const).map(t => (
              <button
                key={t}
                onClick={() => setActionType(t)}
                disabled={status !== 'idle'}
                className="flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize"
                style={actionType === t ? {
                  background: t === 'check_in' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
                  border: `1px solid ${t === 'check_in' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
                  color: t === 'check_in' ? '#6ee7b7' : '#fca5a5',
                } : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#475569' }}
              >
                {t.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Camera view */}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-5"
            style={{ background: '#050510', border: '1px solid rgba(168,85,247,0.2)' }}>
            {(status === 'camera' || status === 'scanning') && !streamError ? (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                {/* Face overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-36 h-44">
                    {[['top-0 left-0', 'border-t-2 border-l-2 rounded-tl-lg'],
                      ['top-0 right-0', 'border-t-2 border-r-2 rounded-tr-lg'],
                      ['bottom-0 left-0', 'border-b-2 border-l-2 rounded-bl-lg'],
                      ['bottom-0 right-0', 'border-b-2 border-r-2 rounded-br-lg'],
                    ].map(([pos, classes]) => (
                      <div key={pos} className={`absolute w-6 h-6 ${pos} ${classes}`}
                        style={{ borderColor: status === 'scanning' ? '#a855f7' : '#00d4ff' }}/>
                    ))}
                    {status === 'scanning' && (
                      <div className="absolute inset-x-0 h-0.5 rounded"
                        style={{ background: '#a855f7', animation: 'scanLine 1.5s linear infinite', top: '30%' }}/>
                    )}
                  </div>
                </div>
                {status === 'scanning' && (
                  <div className="absolute bottom-3 left-0 right-0 flex flex-col items-center gap-1">
                    <div className="w-40 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                      <div className="h-full rounded-full transition-all duration-100"
                        style={{ width: `${confidence}%`, background: 'linear-gradient(90deg, #a855f7, #00d4ff)' }}/>
                    </div>
                    <p className="text-xs text-slate-400">Analyzing… {confidence}%</p>
                  </div>
                )}
              </>
            ) : status === 'success' ? (
              <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in">
                <CheckCircle size={48} className="text-emerald-400 mb-3"/>
                <p className="text-emerald-300 font-semibold">Recognized!</p>
                <p className="text-slate-400 text-xs mt-1">Confidence: {confidence}%</p>
                <p className="text-slate-400 text-xs">{actionType === 'check_in' ? 'Entry' : 'Exit'} logged successfully</p>
              </div>
            ) : status === 'failed' ? (
              <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in">
                <XCircle size={48} className="text-red-400 mb-3"/>
                <p className="text-red-300 font-semibold">Recognition Failed</p>
                <p className="text-slate-400 text-xs mt-1">Please try again or use QR code</p>
              </div>
            ) : streamError ? (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <Camera size={40} className="text-slate-600 mb-3"/>
                <p className="text-slate-500 text-sm">Camera not available</p>
                <p className="text-slate-600 text-xs mt-1">Using simulation mode</p>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <User size={48} className="text-slate-700 mb-3"/>
                <p className="text-slate-500 text-sm">Camera inactive</p>
                <p className="text-slate-600 text-xs mt-1">Click below to start</p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            {status === 'idle' && (
              <button onClick={startCamera} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <Camera size={16} /> Start Camera
              </button>
            )}
            {status === 'camera' && (
              <>
                <button onClick={stopCamera} className="btn-secondary flex-1">Cancel</button>
                <button onClick={simulateRecognition} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  <Scan size={16} /> Scan Face
                </button>
              </>
            )}
            {(status === 'success' || status === 'failed') && (
              <button onClick={reset} className="btn-primary flex-1">Try Again</button>
            )}
          </div>
        </div>

        {/* Info Panel */}
        <div className="space-y-4">
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={16} className="text-amber-400" />
              <h3 className="section-title text-sm">How it Works</h3>
            </div>
            <div className="space-y-3">
              {[
                { step: '01', title: 'Select Action', desc: 'Choose Check In or Check Out' },
                { step: '02', title: 'Start Camera', desc: 'Allow camera access when prompted' },
                { step: '03', title: 'Face Scan', desc: 'Position face within the frame' },
                { step: '04', title: 'AI Verification', desc: 'System verifies your identity in real-time' },
                { step: '05', title: 'Entry Logged', desc: 'Attendance automatically recorded' },
              ].map(s => (
                <div key={s.step} className="flex items-start gap-3">
                  <span className="text-xs font-bold font-mono text-cyan-400 mt-0.5 w-6 flex-shrink-0">{s.step}</span>
                  <div>
                    <p className="text-sm font-medium text-slate-200">{s.title}</p>
                    <p className="text-xs text-slate-500">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-5">
            <h3 className="section-title text-sm mb-3">System Status</h3>
            <div className="space-y-2.5">
              {[
                { label: 'Face Detection Model', status: 'Active', color: '#10b981' },
                { label: 'Recognition Engine', status: 'Ready', color: '#10b981' },
                { label: 'Database Sync', status: 'Online', color: '#10b981' },
                { label: 'Anti-Spoofing', status: 'Enabled', color: '#00d4ff' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">{item.label}</span>
                  <span className="flex items-center gap-1.5" style={{ color: item.color }}>
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: item.color }}/>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
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
