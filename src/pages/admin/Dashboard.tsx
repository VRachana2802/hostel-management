import React from 'react'
import { Users, Home, CreditCard, MessageSquare, TrendingUp, BarChart3 } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { StatCard } from '../../components/ui/StatCard'
import { AttendanceChart } from '../../components/charts/AttendanceChart'
import { PaymentBarChart, OccupancyPieChart } from '../../components/charts/PaymentChart'
import { mockUsers, monthlyPaymentData, occupancyData, weeklyAttendanceData } from '../../lib/mockData'

export function AdminDashboard() {
  const { rooms, payments, complaints } = useData()
  const students = mockUsers.filter(u => u.role === 'student')
  const occupiedRooms = rooms.filter(r => r.status === 'full').length
  const availableRooms = rooms.filter(r => r.status === 'available').length
  const totalRevenue = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0)
  const pendingRevenue = payments.filter(p => p.status !== 'paid').reduce((s, p) => s + p.amount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Hostel Management Overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={students.length} icon={Users} color="blue" trend={{ value: 5, label: 'vs last month' }} />
        <StatCard title="Occupied Rooms" value={`${occupiedRooms}/${rooms.length}`} icon={Home} color="purple" />
        <StatCard title="Revenue Collected" value={`₹${(totalRevenue/1000).toFixed(0)}K`} icon={CreditCard} color="green" trend={{ value: 12, label: 'this month' }} />
        <StatCard title="Open Complaints" value={complaints.filter(c => c.status === 'open').length} icon={MessageSquare} color="red" />
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
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={16} className="text-purple-400" />
            <h3 className="section-title text-sm">Monthly Fee Collection</h3>
          </div>
          <PaymentBarChart data={monthlyPaymentData} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="glass-card p-5">
          <h3 className="section-title text-sm mb-4">Room Occupancy</h3>
          <OccupancyPieChart data={occupancyData} />
          <div className="mt-3 space-y-2">
            {occupancyData.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: d.color }} />
                  <span className="text-slate-400">{d.name}</span>
                </div>
                <span className="text-slate-300 font-medium">{d.value} rooms</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 glass-card p-5">
          <h3 className="section-title text-sm mb-4">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Available Rooms', value: availableRooms, color: '#10b981' },
              { label: 'Under Maintenance', value: rooms.filter(r => r.status === 'maintenance').length, color: '#f59e0b' },
              { label: 'Pending Payments', value: `₹${(pendingRevenue/1000).toFixed(0)}K`, color: '#ef4444' },
              { label: 'Total Wardens', value: mockUsers.filter(u => u.role === 'warden').length, color: '#a855f7' },
              { label: 'Avg Occupancy', value: `${Math.round((occupiedRooms/rooms.length)*100)}%`, color: '#00d4ff' },
              { label: 'Resolved Issues', value: complaints.filter(c => c.status === 'resolved').length, color: '#10b981' },
            ].map(s => (
              <div key={s.label} className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-xl font-bold" style={{ color: s.color, fontFamily: 'Orbitron' }}>{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
