import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Zap, Shield, Users, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import type { UserRole } from '../types'

const DEMO_ACCOUNTS = [
  { label: 'Student Demo', email: 'student@hostel.com', password: 'demo', role: 'student', color: '#00d4ff' },
  { label: 'Warden Demo', email: 'warden@hostel.com', password: 'demo', role: 'warden', color: '#a855f7' },
  { label: 'Admin Demo', email: 'admin@hostel.com', password: 'demo', role: 'admin', color: '#10b981' },
]

export function AuthPage() {
  const navigate = useNavigate()
  const { login, signup, loading } = useAuth()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'student' as UserRole
  })

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    let result
    if (mode === 'login') {
      result = await login(form.email, form.password)
    } else {
      if (!form.name.trim()) { setError('Name is required'); return }
      result = await signup(form.name, form.email, form.password, form.role)
    }
    if (result.error) { setError(result.error); return }
    const role = form.role
    // determine role from mock data on login
    navigate(mode === 'login' ? '/' : `/${role}`)
  }

  const handleDemo = async (acc: typeof DEMO_ACCOUNTS[0]) => {
    setError('')
    const result = await login(acc.email, acc.password)
    if (!result.error) {
      navigate(`/${acc.role}`)
    }
  }

  return (
    <div className="min-h-screen bg-app flex items-center justify-center p-4">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: 'radial-gradient(circle, #00d4ff, transparent)' }} />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 blur-3xl" style={{ background: 'radial-gradient(circle, #10b981, transparent)' }} />
      </div>

      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-0 animate-fade-in">
        {/* Left Panel */}
        <div className="hidden lg:flex flex-col justify-between p-10 rounded-l-2xl"
          style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.06), rgba(168,85,247,0.06))', border: '1px solid rgba(255,255,255,0.08)', borderRight: 'none' }}>
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #00d4ff22, #a855f744)', border: '1px solid rgba(0,212,255,0.3)' }}>
                <Zap size={20} className="text-cyan-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-white" style={{ fontFamily: 'Orbitron', letterSpacing: '0.05em' }}>HostelOS</p>
                <p className="text-xs text-slate-500">Smart Hostel Management</p>
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-3 leading-tight" style={{ fontFamily: 'Orbitron' }}>
              <span className="text-gradient">Next-Gen</span>
              <br />
              <span className="text-white">Hostel Management</span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              A unified platform for students, wardens, and administrators. Manage everything from outpass to fee payments in one intelligent system.
            </p>
          </div>
          <div className="space-y-3">
            {[
              { icon: Shield, label: 'Role-based access control', color: '#00d4ff' },
              { icon: Zap, label: 'AI-powered attendance prediction', color: '#a855f7' },
              { icon: Users, label: 'Real-time entry/exit tracking', color: '#10b981' },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-3 text-sm text-slate-400">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                  <Icon size={14} style={{ color }} />
                </div>
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="glass-card rounded-2xl lg:rounded-l-none lg:rounded-r-2xl p-8">
          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-lg mb-7" style={{ background: 'rgba(255,255,255,0.04)' }}>
            {(['login', 'signup'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError('') }}
                className="flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200 capitalize"
                style={mode === m ? {
                  background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(168,85,247,0.2))',
                  color: '#e2e8f0',
                  border: '1px solid rgba(0,212,255,0.2)',
                } : { color: '#64748b' }}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="label">Full Name</label>
                <input className="input-field" placeholder="Enter your full name"
                  value={form.name} onChange={e => set('name', e.target.value)} />
              </div>
            )}
            <div>
              <label className="label">Email</label>
              <input className="input-field" type="email" placeholder="your@email.com"
                value={form.email} onChange={e => set('email', e.target.value)} required />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input className="input-field pr-10" type={showPw ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={form.password} onChange={e => set('password', e.target.value)} required />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {mode === 'signup' && (
              <div>
                <label className="label">Role</label>
                <select className="input-field" value={form.role} onChange={e => set('role', e.target.value)}>
                  <option value="student">Student</option>
                  <option value="warden">Warden</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}
            {error && (
              <div className="p-3 rounded-lg text-sm text-red-300" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                {error}
              </div>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6">
            <p className="text-xs text-slate-500 text-center mb-3">— Quick Demo Access —</p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map(acc => (
                <button
                  key={acc.role}
                  onClick={() => handleDemo(acc)}
                  disabled={loading}
                  className="py-2 px-2 rounded-lg text-xs font-medium transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background: `${acc.color}12`,
                    border: `1px solid ${acc.color}25`,
                    color: acc.color,
                  }}
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
