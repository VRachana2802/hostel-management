import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import { Layout } from './components/layout/Layout'
import { AuthPage } from './pages/Auth'
import { NotFound } from './pages/NotFound'

// Student pages
import { StudentDashboard } from './pages/student/Dashboard'
import { StudentOutpass } from './pages/student/Outpass'
import { StudentEntryExit } from './pages/student/EntryExit'
import { FaceRecognition } from './pages/student/FaceRecognition'
import { StudentMenu } from './pages/student/MenuBooking'
import { StudentComplaints } from './pages/student/Complaints'
import { StudentPayments } from './pages/student/Payments'
import { StudentNotifications } from './pages/student/Notifications'

// Warden pages
import { WardenDashboard } from './pages/warden/Dashboard'
import { WardenOutpass } from './pages/warden/OutpassManagement'
import { WardenEntryLogs } from './pages/warden/EntryLogs'
import { WardenComplaints } from './pages/warden/ComplaintsManagement'
import { WardenAttendance } from './pages/warden/Attendance'
import { WardenAnnouncements } from './pages/warden/Announcements'

// Admin pages
import { AdminDashboard } from './pages/admin/Dashboard'
import { AdminStudents } from './pages/admin/Students'
import { AdminRooms } from './pages/admin/Rooms'
import { AdminPayments } from './pages/admin/Payments'
import { AdminMenu } from './pages/admin/MenuManagement'
import { AdminAnalytics } from './pages/admin/Analytics'

function RootRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'student') return <Navigate to="/student" replace />
  if (user.role === 'warden') return <Navigate to="/warden" replace />
  return <Navigate to="/admin" replace />
}

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route path="/" element={<RootRedirect />} />

      <Route path="/student" element={<ProtectedRoute roles={['student']}><Layout /></ProtectedRoute>}>
        <Route index element={<StudentDashboard />} />
        <Route path="outpass" element={<StudentOutpass />} />
        <Route path="entry-exit" element={<StudentEntryExit />} />
        <Route path="face-recognition" element={<FaceRecognition />} />
        <Route path="menu" element={<StudentMenu />} />
        <Route path="complaints" element={<StudentComplaints />} />
        <Route path="payments" element={<StudentPayments />} />
        <Route path="notifications" element={<StudentNotifications />} />
      </Route>

      <Route path="/warden" element={<ProtectedRoute roles={['warden']}><Layout /></ProtectedRoute>}>
        <Route index element={<WardenDashboard />} />
        <Route path="outpass" element={<WardenOutpass />} />
        <Route path="entry-logs" element={<WardenEntryLogs />} />
        <Route path="complaints" element={<WardenComplaints />} />
        <Route path="attendance" element={<WardenAttendance />} />
        <Route path="announcements" element={<WardenAnnouncements />} />
      </Route>

      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><Layout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="rooms" element={<AdminRooms />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="menu" element={<AdminMenu />} />
        <Route path="analytics" element={<AdminAnalytics />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <AppRoutes />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
