import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Home } from 'lucide-react'

export function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-app flex items-center justify-center">
      <div className="text-center">
        <p className="text-8xl font-bold text-gradient" style={{ fontFamily: 'Orbitron' }}>404</p>
        <p className="text-xl text-slate-400 mt-4 mb-8">Page not found</p>
        <button onClick={() => navigate('/')} className="btn-primary flex items-center gap-2 mx-auto">
          <Home size={16} /> Go Home
        </button>
      </div>
    </div>
  )
}
