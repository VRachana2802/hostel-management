import React from 'react'
import {
  FileText, CreditCard, MessageSquare, Bell, QrCode, Calendar,
  TrendingUp, Home, Phone, AlertCircle, CheckCircle, Clock
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { StatCard } from '../../components/ui/StatCard'
import { AttendanceChart } from '../../components/charts/AttendanceChart'
import { Badge } from '../../components/ui/Badge'
import { formatDate, formatCurrency } from '../../lib/utils'
import { mockRooms, attendanceTrendData, weeklyAttendanceData } from '../../lib/mockData'

export function StudentDashboard() {
  const { user } = useAuth()
  const { outpasses, payments, complaints, notifications, attendance, announcements } = useData()

  const myOutpasses = outpasses.filter(o => o.student_id === user?.id)
  const myPayments = payments.filter(p => p.student_id === user?.id)
  const myComplaints = complaints.filter(c => c.student_id === user?.id)
  const myNotifs = notifications.filter(n => n.user_id === user?.id && !n.is_read)
  const myAttendance = attendance.filter(a => a.student_id === user?.id)
  const presentDays = myAttendance.filter(a => a.status === 'present').length
  const attendancePct = myAttendance.length ? Math.round((presentDays / myAttendance.length) * 100) : 0
  const pendingPayment = myPayments.find(p => p.status === 'pending' || p.status === 'overdue')
  const room = mockRooms.find(r => r.id === user?.room_id)
  const pendingOutpass = myOutpasses.filter(o => o.status === 'pending').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-title mb-1">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-sm text-slate-500">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        {attendancePct < 75 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-amber-300"
            style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <AlertCircle size={14} />
            Low Attendance: {attendancePct}%
          </div>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Attendance" value={`${attendancePct}%`} subtitle={`${presentDays}/${myAttendance.length} days`} icon={TrendingUp} color={attendancePct >= 75 ? 'green' : 'yellow'} />
        <StatCard title="Outpass" value={myOutpasses.length} subtitle={`${pendingOutpass} pending`} icon={FileText} color="blue" />
        <StatCard title="Complaints" value={myComplaints.length} subtitle={`${myComplaints.filter(c => c.status === 'open').length} open`} icon={MessageSquare} color="purple" />
        <StatCard title="Notifications" value={myNotifs.length} subtitle="unread" icon={Bell} color="pink" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Room Info */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Home size={16} className="text-cyan-400" />
            <h3 className="section-title text-sm">Room Details</h3>
          </div>
          {room ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.12)' }}>
                <span className="text-2xl font-bold text-white" style={{ fontFamily: 'Orbitron' }}>
                  {room.room_no}
                </span>
                <Badge variant="approved">Floor {room.floor}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <p className="text-slate-500 mb-1">Type</p>
                  <p className="text-slate-200 capitalize font-medium">{room.type}</p>
                </div>
                <div className="p-2.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <p className="text-slate-500 mb-1">Occupancy</p>
                  <p className="text-slate-200 font-medium">{room.occupants}/{room.capacity}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">No room allocated</p>
          )}

          {/* Emergency Contact */}
          <div className="mt-4 pt-4 border-t border-white/05">
            <div className="flex items-center gap-2 mb-3">
              <Phone size={14} className="text-red-400" />
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Emergency Contacts</p>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Warden</span>
                <span className="text-slate-300 font-mono">+91 98765 43220</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Security</span>
                <span className="text-slate-300 font-mono">+91 98765 43299</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ambulance</span>
                <span className="text-red-400 font-mono font-medium">108</span>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Chart */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-emerald-400" />
              <h3 className="section-title text-sm">Attendance Trend (30 Days)</h3>
            </div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${attendancePct >= 75 ? 'text-emerald-400 bg-emerald-400/10' : 'text-amber-400 bg-amber-400/10'}`}>
              {attendancePct}% Overall
            </span>
          </div>
          <AttendanceChart data={attendanceTrendData} />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Outpasses */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-cyan-400" />
              <h3 className="section-title text-sm">Recent Outpass</h3>
            </div>
          </div>
          {myOutpasses.length === 0 ? (
            <p className="text-sm text-slate-500 py-4 text-center">No outpass requests</p>
          ) : (
            <div className="space-y-2">
              {myOutpasses.slice(0, 3).map(op => (
                <div key={op.id} className="flex items-start justify-between p-3 rounded-lg hover:bg-white/03 transition-colors"
                  style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <p className="text-sm text-slate-200 font-medium">{op.reason}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{op.destination} · {formatDate(op.departure_date)}</p>
                  </div>
                  <Badge variant={op.status as any}>{op.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Payment & Announcements */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={16} className="text-amber-400" />
            <h3 className="section-title text-sm">Announcements</h3>
          </div>
          <div className="space-y-2">
            {announcements.slice(0, 3).map(ann => (
              <div key={ann.id} className="p-3 rounded-lg"
                style={{ background: ann.is_urgent ? 'rgba(245,158,11,0.06)' : 'rgba(255,255,255,0.03)', border: `1px solid ${ann.is_urgent ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.05)'}` }}>
                <div className="flex items-start gap-2">
                  {ann.is_urgent ? <AlertCircle size={14} className="text-amber-400 mt-0.5 flex-shrink-0" /> : <CheckCircle size={14} className="text-slate-600 mt-0.5 flex-shrink-0" />}
                  <div>
                    <p className="text-xs font-medium text-slate-200">{ann.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{ann.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00d4ff22, #a855f722)' }}>
            <span className="text-[10px]">🤖</span>
          </div>
          <h3 className="section-title text-sm">AI Suggestions</h3>
          <Badge variant="info">Smart</Badge>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          {attendancePct < 75 && (
            <div className="p-3 rounded-lg text-xs" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)' }}>
              <AlertCircle size={14} className="text-amber-400 mb-2" />
              <p className="text-amber-300 font-medium mb-1">Attendance Alert</p>
              <p className="text-slate-400">Your attendance is {attendancePct}%, below the 75% requirement. Attend at least 5 more sessions.</p>
            </div>
          )}
          {pendingPayment && (
            <div className="p-3 rounded-lg text-xs" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
              <CreditCard size={14} className="text-red-400 mb-2" />
              <p className="text-red-300 font-medium mb-1">Fee Reminder</p>
              <p className="text-slate-400">{formatCurrency(pendingPayment.amount)} due on {formatDate(pendingPayment.due_date)}. Pay to avoid penalty.</p>
            </div>
          )}
          <div className="p-3 rounded-lg text-xs" style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)' }}>
            <Clock size={14} className="text-cyan-400 mb-2" />
            <p className="text-cyan-300 font-medium mb-1">Check-in Reminder</p>
            <p className="text-slate-400">Hostel curfew at 10:00 PM. Ensure you return before time to maintain attendance records.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
