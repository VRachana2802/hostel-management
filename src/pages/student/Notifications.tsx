import React from 'react'
import { Bell, CheckCheck, Info, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { formatDate } from '../../lib/utils'

const typeConfig = {
  info: { icon: Info, color: '#00d4ff', bg: 'rgba(0,212,255,0.08)', border: 'rgba(0,212,255,0.15)' },
  success: { icon: CheckCircle, color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.15)' },
  warning: { icon: AlertCircle, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.15)' },
  error: { icon: XCircle, color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.15)' },
}

export function StudentNotifications() {
  const { user } = useAuth()
  const { notifications, markNotificationRead, announcements } = useData()

  const myNotifs = notifications.filter(n => n.user_id === user?.id)
  const unread = myNotifs.filter(n => !n.is_read)

  const markAll = () => myNotifs.forEach(n => !n.is_read && markNotificationRead(n.id))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Notifications</h1>
          {unread.length > 0 && (
            <p className="text-sm text-slate-500 mt-1">{unread.length} unread notification{unread.length > 1 ? 's' : ''}</p>
          )}
        </div>
        {unread.length > 0 && (
          <button onClick={markAll} className="btn-secondary flex items-center gap-2 text-xs">
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      {myNotifs.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-500">
          <Bell size={40} className="mx-auto mb-3 opacity-20" />
          <p>No notifications</p>
        </div>
      ) : (
        <div className="space-y-2">
          {myNotifs.map(n => {
            const cfg = typeConfig[n.type]
            const Icon = cfg.icon
            return (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className="glass-card p-4 cursor-pointer hover:-translate-y-0.5 transition-all duration-150"
                style={!n.is_read ? { borderColor: cfg.border, boxShadow: `0 4px 20px ${cfg.bg}` } : {}}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg flex-shrink-0" style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                    <Icon size={14} style={{ color: cfg.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-sm font-medium text-slate-200">{n.title}</p>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!n.is_read && (
                          <span className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
                        )}
                        <p className="text-xs text-slate-600">{formatDate(n.created_at)}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400">{n.message}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Announcements */}
      <div>
        <h3 className="section-title text-sm mb-3">Hostel Announcements</h3>
        <div className="space-y-2">
          {announcements.map(ann => (
            <div key={ann.id} className="glass-card p-4"
              style={ann.is_urgent ? { borderColor: 'rgba(245,158,11,0.2)' } : {}}>
              <div className="flex items-start gap-3">
                {ann.is_urgent
                  ? <AlertCircle size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
                  : <Bell size={16} className="text-slate-500 mt-0.5 flex-shrink-0" />
                }
                <div>
                  <p className="text-sm font-medium text-slate-200 mb-1">{ann.title}</p>
                  <p className="text-sm text-slate-400">{ann.content}</p>
                  <p className="text-xs text-slate-600 mt-2">{ann.author} · {formatDate(ann.created_at)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
