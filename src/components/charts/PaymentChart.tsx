import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
} from 'recharts'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 text-xs">
        <p className="text-slate-300 font-medium mb-2">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: ₹{p.value?.toLocaleString()}
          </p>
        ))}
      </div>
    )
  }
  return null
}

interface BarProps {
  data: Array<{ month: string; collected: number; pending: number }>
}

export function PaymentBarChart({ data }: BarProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }} barSize={12}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="collected" name="Collected" fill="#00d4ff" radius={[4, 4, 0, 0]} opacity={0.85} />
        <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} opacity={0.85} />
      </BarChart>
    </ResponsiveContainer>
  )
}

interface PieProps {
  data: Array<{ name: string; value: number; color: string }>
}

export function OccupancyPieChart({ data }: PieProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} opacity={0.85} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ background: '#0f0f1f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
          itemStyle={{ color: '#94a3b8', fontSize: 12 }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
