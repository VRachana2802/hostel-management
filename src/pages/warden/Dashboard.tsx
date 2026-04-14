import React from 'react'
import { FileText, MessageSquare, Users, ClipboardList, TrendingUp, AlertCircle } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { StatCard } from '../../components/ui/StatCard'
import { AttendanceChart } from '../../components/charts/AttendanceChart'
import { Badge } from '../../components/ui/Badge'
import { formatDate } from '../../lib/utils'
import { mockUsers, weeklyAttendanceData } from '../../lib/mockData'
import { useAuth } from '../../context/AuthContext'

export function WardenDashboard() {
  const { user } = useAuth()
  const { outpasses, complaints, attendance } = useData()
  const students = mockUsers.filter(u => u.role === 'student')

  const pendingOutpass = outpasses.filter(o => o.status === 'pending')
  const openComplaints = complaints.filter(c => c.status === 'open')
  const todayAttendance = attendance.filter(a => a.date === new Date().toISOString().split('T')[0])
  const presentToday = todayAttendance.filter(a => a.status === 'present').length
  const pct = todayAttendance.length ? Math.round((presentToday / todayAttendance.length) * 100) : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Warden Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Welcome back, {user?.name}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={students.length} icon={Users} color="blue" />
        <StatCard title="Pending Outpass" value={pendingOutpass.length} subtitle="awaiting approval" icon={FileText} color="yellow" />
        <StatCard title="Open Complaints" value={openComplaints.length} icon={MessageSquare} color="red" />
        <StatCard title="Today Present" value={`${pct}%`} subtitle={`${presentToday}/${todayAttendance.length}`} icon={ClipboardList} color="green" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-cyan-400" />
            <h3 className="section-title text-sm">Weekly Attendance</h3>
          </div>
          <AttendanceChart data={weeklyAttendanceData} />
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-amber-400" />
              <h3 className="section-title text-sm">Pending Outpass</h3>
            </div>
            <Badge variant="pending">{pendingOutpass.length}</Badge>
          </div>
          {pendingOutpass.length === 0 ? (
            <p className="text-sm text-slate-500">No pending requests</p>
          ) : (
            <div className="space-y-2">
              {pendingOutpass.slice(0, 4).map(op => (
                <div key={op.id} className="p-3 rounded-lg flex items-start justify-between"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <p className="text-sm font-medium text-slate-200">{op.student_name}</p>
                    <p className="text-xs text-slate-500">{op.reason}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{formatDate(op.departure_date)}</p>
                  </div>
                  <Badge variant="pending">pending</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare size={16} className="text-purple-400" />
          <h3 className="section-title text-sm">Recent Complaints</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Student', 'Category', 'Priority', 'Description', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-xs text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {complaints.slice(0, 5).map(c => (
                <tr key={c.id} className="table-row">
                  <td className="px-4 py-3 text-slate-200">{c.student_name}</td>
                  <td className="px-4 py-3 text-slate-400 capitalize">{c.category}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium capitalize ${
                      c.priority === 'high' ? 'text-red-400' : c.priority === 'medium' ? 'text-yellow-400' : 'text-green-400'
                    }`}>● {c.priority}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 max-w-[200px] truncate">{c.description}</td>
                  <td className="px-4 py-3">
                    <Badge variant={c.status === 'open' ? 'rejected' : c.status === 'resolved' ? 'resolved' : 'pending'}>
                      {c.status.replace('_', ' ')}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
