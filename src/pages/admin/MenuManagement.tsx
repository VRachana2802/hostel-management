import React, { useState } from 'react'
import { BookOpen, Edit2, Save, X, Coffee, Sun, Moon } from 'lucide-react'
import { mockMenu } from '../../lib/mockData'
import type { MenuItem } from '../../types'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const MEAL_ICONS = { breakfast: Coffee, lunch: Sun, dinner: Moon }
const MEAL_COLORS = { breakfast: '#f59e0b', lunch: '#00d4ff', dinner: '#a855f7' }

export function AdminMenu() {
  const [menu, setMenu] = useState<MenuItem[]>(mockMenu)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editItems, setEditItems] = useState('')
  const [selectedDay, setSelectedDay] = useState('Monday')

  const dayMenu = menu.filter(m => m.day === selectedDay)

  const startEdit = (item: MenuItem) => {
    setEditingId(item.id)
    setEditItems(item.items.join(', '))
  }

  const saveEdit = (id: string) => {
    setMenu(prev => prev.map(m => m.id === id ? {
      ...m,
      items: editItems.split(',').map(s => s.trim()).filter(Boolean)
    } : m))
    setEditingId(null)
  }

  const toggleAvailable = (id: string) => {
    setMenu(prev => prev.map(m => m.id === id ? { ...m, is_available: !m.is_available } : m))
  }

  return (
    <div className="space-y-6">
      <h1 className="page-title">Menu Management</h1>

      {/* Day Tabs */}
      <div className="glass-card p-3">
        <div className="flex gap-2 overflow-x-auto">
          {DAYS.map(day => (
            <button key={day} onClick={() => setSelectedDay(day)}
              className="flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={selectedDay === day ? {
                background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(168,85,247,0.2))',
                border: '1px solid rgba(0,212,255,0.3)', color: '#e2e8f0',
              } : { color: '#64748b', border: '1px solid transparent' }}>
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        {(['breakfast', 'lunch', 'dinner'] as const).map(mealType => {
          const item = dayMenu.find(m => m.meal_type === mealType)
          if (!item) return null
          const Icon = MEAL_ICONS[mealType]
          const color = MEAL_COLORS[mealType]
          const isEditing = editingId === item.id

          return (
            <div key={item.id} className="glass-card p-5"
              style={!item.is_available ? { opacity: 0.6 } : {}}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg" style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                    <Icon size={16} style={{ color }} />
                  </div>
                  <span className="font-semibold text-slate-200 capitalize">{mealType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAvailable(item.id)}
                    className="text-xs px-2 py-0.5 rounded-full transition-all"
                    style={item.is_available ? {
                      background: 'rgba(16,185,129,0.12)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.2)'
                    } : {
                      background: 'rgba(239,68,68,0.12)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)'
                    }}
                  >
                    {item.is_available ? 'Available' : 'Unavailable'}
                  </button>
                  {!isEditing && (
                    <button onClick={() => startEdit(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10 transition-colors">
                      <Edit2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  <textarea
                    className="input-field resize-none text-xs"
                    rows={4}
                    value={editItems}
                    onChange={e => setEditItems(e.target.value)}
                    placeholder="Items separated by commas"
                  />
                  <p className="text-xs text-slate-600">Separate items with commas</p>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingId(null)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs btn-secondary">
                      <X size={12} /> Cancel
                    </button>
                    <button onClick={() => saveEdit(item.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs btn-primary">
                      <Save size={12} /> Save
                    </button>
                  </div>
                </div>
              ) : (
                <ul className="space-y-1.5">
                  {item.items.map((food, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
                      {food}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
