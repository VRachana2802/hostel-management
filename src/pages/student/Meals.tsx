import React, { useState } from 'react'
import { UtensilsCrossed, Check, X, Calendar, ChefHat, Coffee, Sun, Moon } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { mockMenu } from '../../lib/mockData'
import { Badge } from '../../components/ui/Badge'
import { cn } from '../../lib/utils'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const MEAL_TYPES = [
  { key: 'breakfast', label: 'Breakfast', icon: Coffee, time: '7:00 – 9:00 AM' },
  { key: 'lunch', label: 'Lunch', icon: Sun, time: '12:00 – 2:00 PM' },
  { key: 'dinner', label: 'Dinner', icon: Moon, time: '7:00 – 9:00 PM' },
] as const

export function StudentMeals() {
  const { user } = useAuth()
  const { mealBookings, addMealBooking, cancelMealBooking } = useData()
  const [selectedDay, setSelectedDay] = useState(DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1])
  const [toast, setToast] = useState<string | null>(null)

  const today = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const getMenuForDayAndMeal = (day: string, mealType: string) => {
    return mockMenu.find(m => m.day === day && m.meal_type === mealType)
  }

  const isBooked = (date: string, mealType: string) => {
    return mealBookings.find(mb =>
      mb.student_id === user?.id &&
      mb.date === date &&
      mb.meal_type === mealType &&
      mb.status === 'booked'
    )
  }

  const handleBook = (date: string, mealType: 'breakfast' | 'lunch' | 'dinner') => {
    const existing = isBooked(date, mealType)
    if (existing) {
      cancelMealBooking(existing.id)
      showToast(`${mealType.charAt(0).toUpperCase() + mealType.slice(1)} booking cancelled`)
    } else {
      addMealBooking({ student_id: user!.id, date, meal_type: mealType, status: 'booked' })
      showToast(`${mealType.charAt(0).toUpperCase() + mealType.slice(1)} booked successfully!`)
    }
  }

  const myBookingsToday = mealBookings.filter(mb => mb.student_id === user?.id && mb.date === today && mb.status === 'booked')
  const totalBooked = mealBookings.filter(mb => mb.student_id === user?.id && mb.status === 'booked').length

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">Meal Booking</h1>
        <p className="text-slate-500 text-sm mt-1">Book your daily meals and view the weekly menu</p>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium animate-fade-in"
          style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#6ee7b7' }}>
          ✓ {toast}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Today's Bookings", value: myBookingsToday.length, max: 3, color: '#00d4ff' },
          { label: 'Total Booked', value: totalBooked, color: '#a855f7' },
          { label: 'Meals This Month', value: Math.floor(totalBooked * 1.8), color: '#10b981' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-4 text-center">
            <p className="text-2xl font-bold" style={{ fontFamily: 'Orbitron', color: stat.color }}>
              {stat.value}{stat.max ? `/${stat.max}` : ''}
            </p>
            <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Today's Quick Book */}
      <div className="glass-card p-5">
        <h2 className="section-title flex items-center gap-2 mb-4">
          <Calendar size={16} className="text-cyan-400" />
          Today's Quick Booking — {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MEAL_TYPES.map(({ key, label, icon: Icon, time }) => {
            const booked = isBooked(today, key)
            const menu = getMenuForDayAndMeal(DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1], key)
            return (
              <div key={key} className={cn('p-4 rounded-xl transition-all duration-200', booked
                ? 'bg-emerald-500/10 border border-emerald-500/25'
                : 'border border-white/08'
              )} style={!booked ? { background: 'rgba(255,255,255,0.03)' } : {}}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon size={15} className={booked ? 'text-emerald-400' : 'text-slate-400'} />
                    <span className="text-sm font-semibold text-slate-200">{label}</span>
                  </div>
                  {booked && <Badge variant="approved">Booked</Badge>}
                </div>
                <p className="text-xs text-slate-500 mb-2">{time}</p>
                {menu && (
                  <p className="text-xs text-slate-400 mb-3 line-clamp-2">{menu.items.slice(0, 3).join(', ')}{menu.items.length > 3 ? '...' : ''}</p>
                )}
                <button onClick={() => handleBook(today, key)}
                  className={cn('w-full py-1.5 rounded-lg text-xs font-medium transition-all duration-200', booked
                    ? 'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20'
                    : 'btn-primary'
                  )}>
                  {booked ? 'Cancel Booking' : 'Book Meal'}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Weekly Menu */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title flex items-center gap-2">
            <ChefHat size={16} className="text-cyan-400" />
            Weekly Menu
          </h2>
        </div>
        {/* Day Selector */}
        <div className="flex gap-1 mb-5 overflow-x-auto pb-1">
          {DAYS.map(day => (
            <button key={day} onClick={() => setSelectedDay(day)}
              className={cn('px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0', selectedDay === day
                ? 'text-white'
                : 'text-slate-500 hover:text-slate-300'
              )}
              style={selectedDay === day ? {
                background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(168,85,247,0.2))',
                border: '1px solid rgba(0,212,255,0.3)',
              } : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {day.slice(0, 3)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MEAL_TYPES.map(({ key, label, icon: Icon, time }) => {
            const menu = getMenuForDayAndMeal(selectedDay, key)
            return (
              <div key={key} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-2 mb-3 pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <Icon size={14} className="text-cyan-400" />
                  <span className="text-sm font-semibold text-slate-200">{label}</span>
                  <span className="text-xs text-slate-500 ml-auto">{time}</span>
                </div>
                {menu ? (
                  <ul className="space-y-1.5">
                    {menu.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-slate-400">
                        <div className="w-1 h-1 rounded-full bg-cyan-400/60 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-600">Menu not available</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
