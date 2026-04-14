import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, FileText, QrCode, Camera, UtensilsCrossed,
  MessageSquare, CreditCard, Bell, LogOut, Menu, X, ChevronRight,
  Users, Home, BarChart3, ClipboardList, Megaphone, Settings,
  ShieldCheck, BookOpen, DoorOpen,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { cn } from '../../lib/utils'

const studentLinks = [
  { to: '/student', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/student/outpass', label: 'Outpass', icon: FileText },
  { to: '/student/entry-exit', label: 'Entry / Exit', icon: QrCode },
  { to: '/student/face-recognition', label: 'Face Recognition', icon: Camera },
  { to: '/student/menu', label: 'Meal Booking', icon: UtensilsCrossed },
  { to: '/student/complaints', label: 'Complaints', icon: MessageSquare },
  { to: '/student/payments', label: 'Fee Payment', icon: CreditCard },
  { to: '/student/notifications', label: 'Notifications', icon: Bell },
]

const wardenLinks = [
  { to: '/warden', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/warden/outpass', label: 'Outpass Requests', icon: FileText },
  { to: '/warden/entry-logs', label: 'Entry Logs', icon: DoorOpen },
  { to: '/warden/complaints', label: 'Complaints', icon: MessageSquare },
  { to: '/warden/attendance', label: 'Attendance', icon: ClipboardList },
  { to: '/warden/announcements', label: 'Announcements', icon: Megaphone },
]

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/students', label: 'Students', icon: Users },
  { to: '/admin/rooms', label: 'Rooms', icon: Home },
  { to: '/admin/payments', label: 'Payments', icon: CreditCard },
  { to: '/admin/menu', label: 'Menu Management', icon: BookOpen },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
]

export function Sidebar() {
  const { user, logout } = useAuth()
  const { getUnreadCount } = useData()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!user) return null

  const links = user.role === 'student' ? studentLinks
    : user.role === 'warden' ? wardenLinks
    : adminLinks

  const unread = getUnreadCount(user.id)

  const roleConfig = {
    student: { label: 'STUDENT PORTAL', color: '#00d4ff', icon: ShieldCheck },
    warden: { label: 'WARDEN PORTAL', color: '#a855f7', icon: ShieldCheck },
    admin: { label: 'ADMIN PORTAL', color: '#10b981', icon: Settings },
  }
  const rc = roleConfig[user.role]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-3 px-4 py-5 border-b',
        'border-white/5'
      )}>
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${rc.color}22, ${rc.color}44)`, border: `1px solid ${rc.color}40` }}
        >
          <span className="text-sm font-bold" style={{ color: rc.color, fontFamily: 'Orbitron' }}>H</span>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white" style={{ fontFamily: 'Orbitron', letterSpacing: '0.05em' }}>
              HostelOS
            </p>
            <p className="text-[9px] font-medium" style={{ color: rc.color, letterSpacing: '0.15em' }}>
              {rc.label}
            </p>
          </div>
        )}
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="mx-3 my-3 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: `${rc.color}20`, color: rc.color, border: `1px solid ${rc.color}30` }}
            >
              {user.avatar || user.name[0]}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav Links */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group relative',
              isActive
                ? 'text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/04'
            )}
            style={({ isActive }) => isActive ? {
              background: `${rc.color}15`,
              border: `1px solid ${rc.color}25`,
            } : {}}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r"
                    style={{ background: rc.color }}
                  />
                )}
                <Icon size={16} className={cn(isActive ? '' : 'group-hover:text-slate-300')}
                  style={isActive ? { color: rc.color } : {}} />
                {!collapsed && (
                  <span className="flex-1 font-medium">{label}</span>
                )}
                {!collapsed && label === 'Notifications' && unread > 0 && (
                  <span
                    className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center"
                    style={{ background: rc.color, color: '#000' }}
                  >
                    {unread}
                  </span>
                )}
                {!collapsed && isActive && (
                  <ChevronRight size={12} className="ml-auto text-slate-600" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/5">
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full',
            'text-slate-400 hover:text-red-400 hover:bg-red-500/08 transition-all duration-150'
          )}
        >
          <LogOut size={16} />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2.5 glass-card rounded-lg text-slate-400 hover:text-white"
      >
        <Menu size={18} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 h-full" style={{ background: '#0a0a17', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white"
            >
              <X size={16} />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col h-screen sticky top-0 flex-shrink-0 transition-all duration-300',
          collapsed ? 'w-16' : 'w-60'
        )}
        style={{ background: '#0a0a17', borderRight: '1px solid rgba(255,255,255,0.06)' }}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 z-10 w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          style={{ background: '#0f0f1f', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <ChevronRight size={12} className={cn('transition-transform', collapsed ? '' : 'rotate-180')} />
        </button>
        <SidebarContent />
      </aside>
    </>
  )
}
