import React from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

interface Props {
  data: Array<{ day?: string; date?: string; present?: number; absent?: number; leave?: number; attendance?: number }>
  type?: 'bar' | 'area'
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 text-xs">
        <p className="text-slate-300 font-medium mb-2">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color }} />
            {p.name}: {p.value}{p.name === 'attendance' ? '%' : ''}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function AttendanceChart({ data, type = 'area' }: Props) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="presentGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="absentGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="attendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis
          dataKey={data[0]?.day ? 'day' : data[0]?.date ? 'date' : 'day'}
          tick={{ fill: '#475569', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        {data[0]?.present !== undefined && (
          <>
            <Area type="monotone" dataKey="present" name="present" stroke="#00d4ff" strokeWidth={2} fill="url(#presentGrad)" dot={false} />
            <Area type="monotone" dataKey="absent" name="absent" stroke="#ef4444" strokeWidth={2} fill="url(#absentGrad)" dot={false} />
          </>
        )}
        {data[0]?.attendance !== undefined && (
          <Area type="monotone" dataKey="attendance" name="attendance" stroke="#10b981" strokeWidth={2} fill="url(#attendGrad)" dot={false} />
        )}
      </AreaChart>
    </ResponsiveContainer>
  )
}
