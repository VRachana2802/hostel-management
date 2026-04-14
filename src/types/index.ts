export type UserRole = 'student' | 'warden' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roll_number?: string;
  phone?: string;
  parent_phone?: string;
  parent_email?: string;
  room_id?: string;
  avatar?: string;
  created_at?: string;
}

export interface Room {
  id: string;
  room_no: string;
  floor: number;
  capacity: number;
  occupants: number;
  type: 'single' | 'double' | 'triple';
  status: 'available' | 'full' | 'maintenance';
}

export interface Outpass {
  id: string;
  student_id: string;
  student_name?: string;
  reason: string;
  destination: string;
  departure_date: string;
  departure_time: string;
  return_date: string;
  return_time: string;
  status: 'pending' | 'approved' | 'rejected';
  parent_verified?: boolean;
  warden_note?: string;
  created_at: string;
}

export interface Attendance {
  id: string;
  student_id: string;
  student_name?: string;
  date: string;
  status: 'present' | 'absent' | 'on-leave';
  check_in?: string;
  check_out?: string;
}

export interface Payment {
  id: string;
  student_id: string;
  student_name?: string;
  type: 'hostel_fee' | 'mess_fee' | 'maintenance' | 'other';
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  due_date: string;
  paid_date?: string;
  description?: string;
}

export interface Complaint {
  id: string;
  student_id: string;
  student_name?: string;
  room_no?: string;
  category: 'maintenance' | 'food' | 'cleanliness' | 'security' | 'other';
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  resolved_at?: string;
  warden_note?: string;
}

export interface MenuItem {
  id: string;
  day: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner';
  items: string[];
  is_available: boolean;
}

export interface MealBooking {
  id: string;
  student_id: string;
  date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner';
  status: 'booked' | 'cancelled';
}

export interface EntryLog {
  id: string;
  student_id: string;
  student_name?: string;
  type: 'check_in' | 'check_out';
  method: 'qr' | 'face' | 'manual';
  timestamp: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  target_role: UserRole | 'all';
  created_at: string;
  is_urgent: boolean;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  created_at: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalRooms: number;
  occupiedRooms: number;
  pendingOutpass: number;
  pendingComplaints: number;
  todayAttendance: number;
  totalRevenue: number;
  pendingPayments: number;
}
