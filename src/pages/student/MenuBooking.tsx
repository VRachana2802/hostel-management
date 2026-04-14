import React, { useState } from 'react'
import { UtensilsCrossed, Coffee, Sun, Moon, CheckCircle, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { mockMenu } from '../../lib/mockData'
import { cn } from '../../lib/utils'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const MEAL_ICONS = { breakfast: Coffee, lunch: Sun, dinner: Moon }
const MEAL_COLORS = { breakfast: '#f59e0b', lunch: '#00d4ff', dinner: '#a855f7' }

export function StudentMenu() {
  const { user } = useAuth()
  const { mealBookings, addMealBooking, cancelMealBooking } = useData()
  const [selectedDay, setSelectedDay] = useState(DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1])

  const todayMenu = mockMenu.filter(m => m.day === selectedDay)
  const myBookings = mealBookings.filter(b => b.student_id === user?.id && b.status === 'booked')

  const isBooked = (mealType: string) => {
    const today = new Date().toISOString().split('T')[0]
    return myBookings.some(b => b.date === today && b.meal_type === mealType)
  }

  const handleBook = (mealType: 'breakfast' | 'lunch' | 'dinner') => {
    if (!user) return
    const today = new Date().toISOString().split('T')[0]
    const existing = myBookings.find(b => b.date === today && b.meal_type === mealType)
    if (existing) {
      cancelMealBooking(existing.id)
    } else {
      addMealBooking({ student_id: user.id, date: today, meal_type: mealType, status: 'booked' })
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="page-title">Meal Booking</h1>

      {/* Day Selector */}
      <div className="glass-card p-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {DAYS.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={cn(
                'flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                selectedDay === day ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              )}
              style={selectedDay === day ? {
                background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(168,85,247,0.2))',
                border: '1px solid rgba(0,212,255,0.3)',
              } : { border: '1px solid transparent' }}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* Meal Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {(['breakfast', 'lunch', 'dinner'] as const).map(mealType => {
          const menu = todayMenu.find(m => m.meal_type === mealType)
          const Icon = MEAL_ICONS[mealType]
          const color = MEAL_COLORS[mealType]
          const booked = selectedDay === DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1] && isBooked(mealType)

          return (
            <div key={mealType} className="glass-card p-5 flex flex-col"
              style={booked ? { borderColor: `${color}40` } : {}}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg" style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                    <Icon size={16} style={{ color }} />
                  </div>
                  <span className="text-sm font-semibold text-slate-200 capitalize">{mealType}</span>
                </div>
                {booked && <CheckCircle size={16} className="text-emerald-400" />}
              </div>

              {menu ? (
                <ul className="flex-1 space-y-1.5 mb-4">
                  {menu.items.map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-400">
                      <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: color }}/>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="flex-1 text-sm text-slate-500 mb-4">Menu not available</p>
              )}

              {selectedDay === DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1] && (
                <button
                  onClick={() => handleBook(mealType)}
                  className="w-full py-2 rounded-lg text-sm font-medium transition-all duration-150"
                  style={booked ? {
                    background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5'
                  } : {
                    background: `${color}15`, border: `1px solid ${color}30`, color
                  }}
                >
                  {booked ? (
                    <span className="flex items-center justify-center gap-1.5"><X size={14}/>Cancel</span>
                  ) : (
                    <span className="flex items-center justify-center gap-1.5"><UtensilsCrossed size={14}/>Book</span>
                  )}
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Booking Summary */}
      <div className="glass-card p-5">
        <h3 className="section-title text-sm mb-4">Today's Bookings</h3>
        {myBookings.length === 0 ? (
          <p className="text-sm text-slate-500">No meals booked for today</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {myBookings.map(b => {
              const color = MEAL_COLORS[b.meal_type as keyof typeof MEAL_COLORS]
              return (
                <span key={b.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm capitalize"
                  style={{ background: `${color}15`, border: `1px solid ${color}25`, color }}>
                  <CheckCircle size={13} />{b.meal_type}
                </span>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
