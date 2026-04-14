import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type {
  Outpass, Complaint, Payment, MealBooking, EntryLog,
  Announcement, Notification, Room, Attendance
} from '../types'
import {
  mockOutpasses, mockComplaints, mockPayments, mockMealBookings,
  mockEntryLogs, mockAnnouncements, mockNotifications, mockRooms, mockAttendance
} from '../lib/mockData'
import { generateId, simulateEmailNotification } from '../lib/utils'

interface DataContextType {
  outpasses: Outpass[]
  complaints: Complaint[]
  payments: Payment[]
  mealBookings: MealBooking[]
  entryLogs: EntryLog[]
  announcements: Announcement[]
  notifications: Notification[]
  rooms: Room[]
  attendance: Attendance[]
  addOutpass: (op: Omit<Outpass, 'id' | 'created_at'>) => void
  updateOutpass: (id: string, updates: Partial<Outpass>) => void
  addComplaint: (c: Omit<Complaint, 'id' | 'created_at'>) => void
  updateComplaint: (id: string, updates: Partial<Complaint>) => void
  addPayment: (p: Omit<Payment, 'id'>) => void
  updatePayment: (id: string, updates: Partial<Payment>) => void
  addMealBooking: (mb: Omit<MealBooking, 'id'>) => void
  cancelMealBooking: (id: string) => void
  addEntryLog: (log: Omit<EntryLog, 'id'>) => void
  addAnnouncement: (ann: Omit<Announcement, 'id'>) => void
  markNotificationRead: (id: string) => void
  addNotification: (n: Omit<Notification, 'id'>) => void
  updateRoom: (id: string, updates: Partial<Room>) => void
  getUnreadCount: (userId: string) => number
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [outpasses, setOutpasses] = useState<Outpass[]>(mockOutpasses)
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints)
  const [payments, setPayments] = useState<Payment[]>(mockPayments)
  const [mealBookings, setMealBookings] = useState<MealBooking[]>(mockMealBookings)
  const [entryLogs, setEntryLogs] = useState<EntryLog[]>(mockEntryLogs)
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [rooms, setRooms] = useState<Room[]>(mockRooms)
  const [attendance] = useState<Attendance[]>(mockAttendance)

  const addOutpass = useCallback((op: Omit<Outpass, 'id' | 'created_at'>) => {
    const newOp = { ...op, id: `op-${generateId()}`, created_at: new Date().toISOString() }
    setOutpasses(prev => [newOp, ...prev])
  }, [])

  const updateOutpass = useCallback((id: string, updates: Partial<Outpass>) => {
    setOutpasses(prev => prev.map(op => op.id === id ? { ...op, ...updates } : op))
    if (updates.status === 'approved') {
      simulateEmailNotification(
        'parent@email.com',
        'Outpass Approved',
        `Your ward's outpass request has been approved.`
      )
    }
  }, [])

  const addComplaint = useCallback((c: Omit<Complaint, 'id' | 'created_at'>) => {
    const newC = { ...c, id: `comp-${generateId()}`, created_at: new Date().toISOString() }
    setComplaints(prev => [newC, ...prev])
  }, [])

  const updateComplaint = useCallback((id: string, updates: Partial<Complaint>) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
  }, [])

  const addPayment = useCallback((p: Omit<Payment, 'id'>) => {
    const newP = { ...p, id: `pay-${generateId()}` }
    setPayments(prev => [newP, ...prev])
  }, [])

  const updatePayment = useCallback((id: string, updates: Partial<Payment>) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
  }, [])

  const addMealBooking = useCallback((mb: Omit<MealBooking, 'id'>) => {
    const newMb = { ...mb, id: `mb-${generateId()}` }
    setMealBookings(prev => [newMb, ...prev])
  }, [])

  const cancelMealBooking = useCallback((id: string) => {
    setMealBookings(prev => prev.map(mb => mb.id === id ? { ...mb, status: 'cancelled' as const } : mb))
  }, [])

  const addEntryLog = useCallback((log: Omit<EntryLog, 'id'>) => {
    const newLog = { ...log, id: `log-${generateId()}` }
    setEntryLogs(prev => [newLog, ...prev])
  }, [])

  const addAnnouncement = useCallback((ann: Omit<Announcement, 'id'>) => {
    const newAnn = { ...ann, id: `ann-${generateId()}` }
    setAnnouncements(prev => [newAnn, ...prev])
  }, [])

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
  }, [])

  const addNotification = useCallback((n: Omit<Notification, 'id'>) => {
    const newN = { ...n, id: `notif-${generateId()}` }
    setNotifications(prev => [newN, ...prev])
  }, [])

  const updateRoom = useCallback((id: string, updates: Partial<Room>) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r))
  }, [])

  const getUnreadCount = useCallback((userId: string) => {
    return notifications.filter(n => n.user_id === userId && !n.is_read).length
  }, [notifications])

  return (
    <DataContext.Provider value={{
      outpasses, complaints, payments, mealBookings, entryLogs,
      announcements, notifications, rooms, attendance,
      addOutpass, updateOutpass, addComplaint, updateComplaint,
      addPayment, updatePayment, addMealBooking, cancelMealBooking,
      addEntryLog, addAnnouncement, markNotificationRead, addNotification,
      updateRoom, getUnreadCount,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
