import React, { useState } from 'react'
import { ClipboardList, TrendingUp } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { mockUsers } from '../../lib/mockData'
import { Badge } from '../../components/ui/Badge'
import { AttendanceChart } from '../../components/charts/AttendanceChart'
import { weeklyAttendanceData } from '../../lib/mockData'

export function WardenAttendance() {
  const { attendance } = useData()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  const students = mockUsers.filter(u => u.role === 'student')
  const dayAttendance = attendance.filter(a => a.date === selectedDate)

  const getStudentAttendance = (studentId: string) => {
    const records = attendance.filter(a => a.student_id === studentId)
    const present = records.filter(a => a.status === 'present').length
    const pct = records.length ? Math.round((present / records.length) * 100) : 0
    const today = dayAttendance.find(a => a.student_id === studentId)
    return { pct, today, total: records.length, present }
  }

  return (
    <div className="space-y-6">
      <h1 className="page-title">Attendance Overview</h1>

      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} className="text-cyan-400" />
          <h3 className="section-title text-sm">Weekly Trend</h3>
        </div>
        <AttendanceChart data={weeklyAttendanceData} />
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2">
            <ClipboardList size={16} className="text-purple-400" />
            <h3 className="section-title text-sm">Student Attendance</h3>
          </div>
          <input type="date" className="input-field w-auto text-xs py-1.5 px-3"
            value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Student', 'Roll No', 'Today', 'Overall %', 'Present/Total', 'AI Prediction'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map(s => {
                const { pct, today, total, present } = getStudentAttendance(s.id)
                const atRisk = pct < 75
                const predicted = Math.min(100, pct + Math.floor(Math.random() * 5 - 2))
                return (
                  <tr key={s.id} className="table-row">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-slate-200">{s.name}</p>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 font-mono text-xs">{s.roll_number}</td>
                    <td className="px-5 py-3.5">
                      {today ? (
                        <Badge variant={today.status === 'present' ? 'approved' : today.status === 'absent' ? 'rejected' : 'pending'}>
                          {today.status}
                        </Badge>
                      ) : <span className="text-xs text-slate-600">—</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                          <div className="h-full rounded-full" style={{
                            width: `${pct}%`,
                            background: pct >= 75 ? '#10b981' : '#ef4444'
                          }}/>
                        </div>
                        <span className={`text-xs font-medium ${atRisk ? 'text-red-400' : 'text-emerald-400'}`}>{pct}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 text-xs">{present}/{total}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs flex items-center gap-1 ${atRisk ? 'text-amber-400' : 'text-slate-500'}`}>
                        {atRisk ? '⚠️ At risk' : `↗ ${predicted}%`}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
