import React from 'react'
import { BarChart3, TrendingUp, Users, Home, CreditCard } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { AttendanceChart } from '../../components/charts/AttendanceChart'
import { PaymentBarChart, OccupancyPieChart } from '../../components/charts/PaymentChart'
import {
  monthlyPaymentData, occupancyData, weeklyAttendanceData, attendanceTrendData
} from '../../lib/mockData'
import { mockUsers } from '../../lib/mockData'
import { formatCurrency } from '../../lib/utils'
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts'

const radarData = [
  { subject: 'Attendance', A: 85 },
  { subject: 'Fee Collection', A: 78 },
  { subject: 'Room Occupancy', A: 70 },
  { subject: 'Complaint Resolution', A: 60 },
  { subject: 'Meal Bookings', A: 90 },
  { subject: 'Security', A: 95 },
]

export function AdminAnalytics() {
  const { rooms, payments, complaints, attendance } = useData()
  const students = mockUsers.filter(u => u.role === 'student')
  const totalRevenue = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0)
  const presentToday = attendance.filter(a => {
    const today = new Date().toISOString().split('T')[0]
    return a.date === today && a.status === 'present'
  }).length
  const resolvedComplaints = complaints.filter(c => c.status === 'resolved').length
  const resolutionRate = complaints.length ? Math.round((resolvedComplaints / complaints.length) * 100) : 0
  const occupiedRooms = rooms.filter(r => r.status === 'full').length
  const occupancyRate = Math.round((occupiedRooms / rooms.length) * 100)

  return (
    <div className="space-y-6">
      <h1 className="page-title">Analytics & Reports</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Revenue This Month', value: formatCurrency(totalRevenue), icon: CreditCard, color: '#10b981' },
          { label: 'Present Today', value: `${presentToday}/${students.length}`, icon: Users, color: '#00d4ff' },
          { label: 'Occupancy Rate', value: `${occupancyRate}%`, icon: Home, color: '#a855f7' },
          { label: 'Issue Resolution', value: `${resolutionRate}%`, icon: BarChart3, color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} className="glass-card p-5">
            <s.icon size={18} className="mb-3" style={{ color: s.color }} />
            <p className="text-2xl font-bold text-white" style={{ fontFamily: 'Orbitron', fontSize: '20px' }}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Attendance Trend */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-cyan-400" />
            <h3 className="section-title text-sm">30-Day Attendance Trend</h3>
          </div>
          <AttendanceChart data={attendanceTrendData} />
        </div>

        {/* Payment Chart */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={16} className="text-purple-400" />
            <h3 className="section-title text-sm">Fee Collection (6 Months)</h3>
          </div>
          <PaymentBarChart data={monthlyPaymentData} />
          <div className="flex items-center gap-4 mt-3 text-xs">
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm" style={{ background: '#00d4ff' }} /><span className="text-slate-400">Collected</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm" style={{ background: '#f59e0b' }} /><span className="text-slate-400">Pending</span></div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Occupancy */}
        <div className="glass-card p-5">
          <h3 className="section-title text-sm mb-2">Room Occupancy</h3>
          <OccupancyPieChart data={occupancyData} />
          <div className="space-y-2 mt-2">
            {occupancyData.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                  <span className="text-slate-400">{d.name}</span>
                </div>
                <span className="text-slate-300 font-medium">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Radar */}
        <div className="glass-card p-5">
          <h3 className="section-title text-sm mb-4">Performance Overview</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 10 }} />
              <Radar name="Score" dataKey="A" stroke="#00d4ff" fill="#00d4ff" fillOpacity={0.15} strokeWidth={1.5} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Complaint Stats */}
        <div className="glass-card p-5">
          <h3 className="section-title text-sm mb-4">Complaint Breakdown</h3>
          <div className="space-y-3">
            {[
              { cat: 'Maintenance', count: complaints.filter(c => c.category === 'maintenance').length, color: '#00d4ff' },
              { cat: 'Food', count: complaints.filter(c => c.category === 'food').length, color: '#f59e0b' },
              { cat: 'Cleanliness', count: complaints.filter(c => c.category === 'cleanliness').length, color: '#a855f7' },
              { cat: 'Security', count: complaints.filter(c => c.category === 'security').length, color: '#ef4444' },
              { cat: 'Other', count: complaints.filter(c => c.category === 'other').length, color: '#10b981' },
            ].map(s => (
              <div key={s.cat}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">{s.cat}</span>
                  <span className="text-slate-300">{s.count}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full"
                    style={{ width: `${complaints.length ? (s.count / complaints.length) * 100 : 0}%`, background: s.color }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <p className="text-xs text-slate-500 mb-2">Resolution Rate</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full" style={{ width: `${resolutionRate}%`, background: 'linear-gradient(90deg, #10b981, #00d4ff)' }} />
              </div>
              <span className="text-sm font-bold text-emerald-400">{resolutionRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-base">🤖</span>
          <h3 className="section-title text-sm">AI Insights & Recommendations</h3>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            {
              title: 'Attendance Prediction',
              insight: `Based on current trends, attendance is predicted to be ~82% next week. Consider sending reminders to 3 at-risk students.`,
              color: '#00d4ff', icon: '📊'
            },
            {
              title: 'Fee Collection Alert',
              insight: `₹${formatCurrency(75000)} in payments due this month. 4 students have overdue payments. Automated reminders recommended.`,
              color: '#f59e0b', icon: '💰'
            },
            {
              title: 'Room Optimization',
              insight: `${availableRooms(rooms)} rooms available. Consider shifting 2 students from triple to double rooms to improve comfort.`,
              color: '#a855f7', icon: '🏠'
            },
          ].map(s => (
            <div key={s.title} className="p-4 rounded-xl text-sm"
              style={{ background: `${s.color}08`, border: `1px solid ${s.color}18` }}>
              <div className="text-2xl mb-2">{s.icon}</div>
              <p className="font-semibold mb-1.5" style={{ color: s.color }}>{s.title}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{s.insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function availableRooms(rooms: any[]) {
  return rooms.filter((r: any) => r.status === 'available').length
}
