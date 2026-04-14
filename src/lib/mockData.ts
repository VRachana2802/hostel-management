import type {
  User, Room, Outpass, Attendance, Payment,
  Complaint, MenuItem, EntryLog, Announcement, Notification, MealBooking
} from '../types'

export const mockUsers: User[] = [
  {
    id: 'student-1',
    name: 'Arjun Sharma',
    email: 'student@hostel.com',
    role: 'student',
    roll_number: 'CS2021001',
    phone: '9876543210',
    parent_phone: '9876543211',
    parent_email: 'parent@email.com',
    room_id: 'room-101',
    avatar: 'AS',
  },
  {
    id: 'warden-1',
    name: 'Dr. Priya Nair',
    email: 'warden@hostel.com',
    role: 'warden',
    phone: '9876543220',
    avatar: 'PN',
  },
  {
    id: 'admin-1',
    name: 'Rajesh Kumar',
    email: 'admin@hostel.com',
    role: 'admin',
    phone: '9876543230',
    avatar: 'RK',
  },
  {
    id: 'student-2',
    name: 'Kavya Reddy',
    email: 'kavya@hostel.com',
    role: 'student',
    roll_number: 'CS2021002',
    phone: '9876543212',
    parent_email: 'kavya.parent@email.com',
    room_id: 'room-102',
    avatar: 'KR',
  },
  {
    id: 'student-3',
    name: 'Rahul Patel',
    email: 'rahul@hostel.com',
    role: 'student',
    roll_number: 'CS2021003',
    phone: '9876543213',
    room_id: 'room-103',
    avatar: 'RP',
  },
  {
    id: 'student-4',
    name: 'Sneha Iyer',
    email: 'sneha@hostel.com',
    role: 'student',
    roll_number: 'CS2021004',
    phone: '9876543214',
    room_id: 'room-104',
    avatar: 'SI',
  },
  {
    id: 'student-5',
    name: 'Vikram Singh',
    email: 'vikram@hostel.com',
    role: 'student',
    roll_number: 'CS2021005',
    phone: '9876543215',
    room_id: 'room-105',
    avatar: 'VS',
  },
]

export const mockRooms: Room[] = [
  { id: 'room-101', room_no: '101', floor: 1, capacity: 2, occupants: 2, type: 'double', status: 'full' },
  { id: 'room-102', room_no: '102', floor: 1, capacity: 2, occupants: 1, type: 'double', status: 'available' },
  { id: 'room-103', room_no: '103', floor: 1, capacity: 3, occupants: 3, type: 'triple', status: 'full' },
  { id: 'room-104', room_no: '104', floor: 1, capacity: 1, occupants: 1, type: 'single', status: 'full' },
  { id: 'room-105', room_no: '105', floor: 1, capacity: 2, occupants: 1, type: 'double', status: 'available' },
  { id: 'room-201', room_no: '201', floor: 2, capacity: 2, occupants: 0, type: 'double', status: 'available' },
  { id: 'room-202', room_no: '202', floor: 2, capacity: 3, occupants: 2, type: 'triple', status: 'available' },
  { id: 'room-203', room_no: '203', floor: 2, capacity: 1, occupants: 0, type: 'single', status: 'maintenance' },
  { id: 'room-204', room_no: '204', floor: 2, capacity: 2, occupants: 2, type: 'double', status: 'full' },
  { id: 'room-205', room_no: '205', floor: 2, capacity: 3, occupants: 1, type: 'triple', status: 'available' },
  { id: 'room-301', room_no: '301', floor: 3, capacity: 2, occupants: 2, type: 'double', status: 'full' },
  { id: 'room-302', room_no: '302', floor: 3, capacity: 2, occupants: 0, type: 'double', status: 'available' },
]

export const mockOutpasses: Outpass[] = [
  {
    id: 'op-1',
    student_id: 'student-1',
    student_name: 'Arjun Sharma',
    reason: 'Medical appointment at Apollo Hospital',
    destination: 'Apollo Hospital, Chennai',
    departure_date: '2024-03-15',
    departure_time: '09:00',
    return_date: '2024-03-15',
    return_time: '18:00',
    status: 'approved',
    parent_verified: true,
    created_at: '2024-03-14T10:00:00Z',
  },
  {
    id: 'op-2',
    student_id: 'student-1',
    student_name: 'Arjun Sharma',
    reason: 'Family function at home',
    destination: 'Coimbatore',
    departure_date: '2024-03-20',
    departure_time: '08:00',
    return_date: '2024-03-22',
    return_time: '20:00',
    status: 'pending',
    parent_verified: false,
    created_at: '2024-03-18T08:30:00Z',
  },
  {
    id: 'op-3',
    student_id: 'student-2',
    student_name: 'Kavya Reddy',
    reason: 'Company interview',
    destination: 'TCS Office, Chennai',
    departure_date: '2024-03-16',
    departure_time: '10:00',
    return_date: '2024-03-16',
    return_time: '17:00',
    status: 'approved',
    parent_verified: true,
    created_at: '2024-03-15T09:00:00Z',
  },
  {
    id: 'op-4',
    student_id: 'student-3',
    student_name: 'Rahul Patel',
    reason: 'Personal work',
    destination: 'T. Nagar, Chennai',
    departure_date: '2024-03-17',
    departure_time: '14:00',
    return_date: '2024-03-17',
    return_time: '22:00',
    status: 'rejected',
    warden_note: 'Insufficient reason provided. Please reapply with more details.',
    created_at: '2024-03-16T11:00:00Z',
  },
  {
    id: 'op-5',
    student_id: 'student-4',
    student_name: 'Sneha Iyer',
    reason: 'College fest participation',
    destination: 'IIT Madras',
    departure_date: '2024-03-25',
    departure_time: '07:30',
    return_date: '2024-03-26',
    return_time: '21:00',
    status: 'pending',
    parent_verified: true,
    created_at: '2024-03-20T14:00:00Z',
  },
]

export const generateAttendance = (): Attendance[] => {
  const records: Attendance[] = []
  const students = ['student-1', 'student-2', 'student-3', 'student-4', 'student-5']
  const statuses: Array<'present' | 'absent' | 'on-leave'> = ['present', 'present', 'present', 'absent', 'on-leave']
  const names = ['Arjun Sharma', 'Kavya Reddy', 'Rahul Patel', 'Sneha Iyer', 'Vikram Singh']

  for (let i = 29; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]

    students.forEach((sid, idx) => {
      const rand = Math.random()
      const status = rand > 0.85 ? 'absent' : rand > 0.93 ? 'on-leave' : 'present'
      records.push({
        id: `att-${sid}-${i}`,
        student_id: sid,
        student_name: names[idx],
        date: dateStr,
        status,
        check_in: status === 'present' ? '08:' + String(Math.floor(Math.random() * 30)).padStart(2, '0') : undefined,
        check_out: status === 'present' ? '22:' + String(Math.floor(Math.random() * 59)).padStart(2, '0') : undefined,
      })
    })
  }
  return records
}

export const mockAttendance: Attendance[] = generateAttendance()

export const mockPayments: Payment[] = [
  {
    id: 'pay-1',
    student_id: 'student-1',
    student_name: 'Arjun Sharma',
    type: 'hostel_fee',
    amount: 25000,
    status: 'paid',
    due_date: '2024-01-31',
    paid_date: '2024-01-25',
    description: 'Hostel Fee - Jan 2024',
  },
  {
    id: 'pay-2',
    student_id: 'student-1',
    student_name: 'Arjun Sharma',
    type: 'mess_fee',
    amount: 3500,
    status: 'paid',
    due_date: '2024-02-05',
    paid_date: '2024-02-03',
    description: 'Mess Fee - Feb 2024',
  },
  {
    id: 'pay-3',
    student_id: 'student-1',
    student_name: 'Arjun Sharma',
    type: 'hostel_fee',
    amount: 25000,
    status: 'pending',
    due_date: '2024-03-31',
    description: 'Hostel Fee - Mar 2024',
  },
  {
    id: 'pay-4',
    student_id: 'student-2',
    student_name: 'Kavya Reddy',
    type: 'hostel_fee',
    amount: 25000,
    status: 'overdue',
    due_date: '2024-02-28',
    description: 'Hostel Fee - Feb 2024',
  },
  {
    id: 'pay-5',
    student_id: 'student-3',
    student_name: 'Rahul Patel',
    type: 'mess_fee',
    amount: 3500,
    status: 'paid',
    due_date: '2024-03-05',
    paid_date: '2024-03-01',
    description: 'Mess Fee - Mar 2024',
  },
  {
    id: 'pay-6',
    student_id: 'student-4',
    student_name: 'Sneha Iyer',
    type: 'maintenance',
    amount: 500,
    status: 'pending',
    due_date: '2024-03-31',
    description: 'Maintenance charges - Mar 2024',
  },
]

export const mockComplaints: Complaint[] = [
  {
    id: 'comp-1',
    student_id: 'student-1',
    student_name: 'Arjun Sharma',
    room_no: '101',
    category: 'maintenance',
    description: 'Water leakage from the bathroom ceiling. It has been dripping for 2 days.',
    status: 'in_progress',
    priority: 'high',
    created_at: '2024-03-10T09:00:00Z',
    warden_note: 'Plumber has been assigned. Work will be done by tomorrow.',
  },
  {
    id: 'comp-2',
    student_id: 'student-1',
    student_name: 'Arjun Sharma',
    room_no: '101',
    category: 'cleanliness',
    description: 'Common washroom not cleaned for 3 days. Unhygienic conditions.',
    status: 'resolved',
    priority: 'medium',
    created_at: '2024-03-05T10:00:00Z',
    resolved_at: '2024-03-06T15:00:00Z',
  },
  {
    id: 'comp-3',
    student_id: 'student-2',
    student_name: 'Kavya Reddy',
    room_no: '102',
    category: 'food',
    description: 'Food quality has degraded significantly. Dal is not properly cooked.',
    status: 'open',
    priority: 'medium',
    created_at: '2024-03-15T12:00:00Z',
  },
  {
    id: 'comp-4',
    student_id: 'student-3',
    student_name: 'Rahul Patel',
    room_no: '103',
    category: 'security',
    description: 'Main gate CCTV camera is not working since past week.',
    status: 'open',
    priority: 'high',
    created_at: '2024-03-14T16:00:00Z',
  },
  {
    id: 'comp-5',
    student_id: 'student-4',
    student_name: 'Sneha Iyer',
    room_no: '104',
    category: 'maintenance',
    description: 'Wi-Fi connection in room 104 is extremely slow and keeps disconnecting.',
    status: 'in_progress',
    priority: 'medium',
    created_at: '2024-03-12T14:00:00Z',
  },
]

export const mockMenu: MenuItem[] = [
  { id: 'menu-1', day: 'Monday', meal_type: 'breakfast', items: ['Idli', 'Sambar', 'Chutney', 'Tea/Coffee'], is_available: true },
  { id: 'menu-2', day: 'Monday', meal_type: 'lunch', items: ['Rice', 'Dal', 'Rajma', 'Roti', 'Salad', 'Curd'], is_available: true },
  { id: 'menu-3', day: 'Monday', meal_type: 'dinner', items: ['Chapati', 'Paneer Butter Masala', 'Rice', 'Dal Tadka', 'Sweet'], is_available: true },
  { id: 'menu-4', day: 'Tuesday', meal_type: 'breakfast', items: ['Dosa', 'Sambar', 'Chutney', 'Juice'], is_available: true },
  { id: 'menu-5', day: 'Tuesday', meal_type: 'lunch', items: ['Rice', 'Sambar', 'Rasam', 'Papad', 'Pickle', 'Curd'], is_available: true },
  { id: 'menu-6', day: 'Tuesday', meal_type: 'dinner', items: ['Puri', 'Chana Masala', 'Kheer'], is_available: true },
  { id: 'menu-7', day: 'Wednesday', meal_type: 'breakfast', items: ['Upma', 'Boiled Eggs', 'Bread', 'Tea'], is_available: true },
  { id: 'menu-8', day: 'Wednesday', meal_type: 'lunch', items: ['Biryani', 'Raita', 'Salad', 'Buttermilk'], is_available: true },
  { id: 'menu-9', day: 'Wednesday', meal_type: 'dinner', items: ['Paratha', 'Mix Veg', 'Dal', 'Fruit Custard'], is_available: true },
  { id: 'menu-10', day: 'Thursday', meal_type: 'breakfast', items: ['Poha', 'Banana', 'Milk', 'Tea'], is_available: true },
  { id: 'menu-11', day: 'Thursday', meal_type: 'lunch', items: ['Rice', 'Chicken Curry', 'Dal', 'Roti', 'Salad'], is_available: true },
  { id: 'menu-12', day: 'Thursday', meal_type: 'dinner', items: ['Roti', 'Dal Makhani', 'Rice', 'Halwa'], is_available: true },
  { id: 'menu-13', day: 'Friday', meal_type: 'breakfast', items: ['Pongal', 'Coconut Chutney', 'Coffee', 'Fruits'], is_available: true },
  { id: 'menu-14', day: 'Friday', meal_type: 'lunch', items: ['Fried Rice', 'Manchurian', 'Soup', 'Curd'], is_available: true },
  { id: 'menu-15', day: 'Friday', meal_type: 'dinner', items: ['Chapati', 'Shahi Paneer', 'Jeera Rice', 'Gulab Jamun'], is_available: true },
  { id: 'menu-16', day: 'Saturday', meal_type: 'breakfast', items: ['Vada', 'Sambar', 'Chutney', 'Tea'], is_available: true },
  { id: 'menu-17', day: 'Saturday', meal_type: 'lunch', items: ['Special Meals', 'Biryani', 'Raita', 'Dessert'], is_available: true },
  { id: 'menu-18', day: 'Saturday', meal_type: 'dinner', items: ['Noodles', 'Fried Rice', 'Manchurian'], is_available: true },
  { id: 'menu-19', day: 'Sunday', meal_type: 'breakfast', items: ['Bread', 'Omelette', 'Cornflakes', 'Milk'], is_available: true },
  { id: 'menu-20', day: 'Sunday', meal_type: 'lunch', items: ['Special Non-Veg', 'Pulao', 'Raita', 'Sweet'], is_available: true },
  { id: 'menu-21', day: 'Sunday', meal_type: 'dinner', items: ['Pizza', 'Pasta', 'Garlic Bread', 'Cold Drink'], is_available: true },
]

export const mockEntryLogs: EntryLog[] = [
  { id: 'log-1', student_id: 'student-1', student_name: 'Arjun Sharma', type: 'check_in', method: 'qr', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: 'log-2', student_id: 'student-2', student_name: 'Kavya Reddy', type: 'check_in', method: 'face', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
  { id: 'log-3', student_id: 'student-3', student_name: 'Rahul Patel', type: 'check_out', method: 'qr', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() },
  { id: 'log-4', student_id: 'student-4', student_name: 'Sneha Iyer', type: 'check_in', method: 'manual', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
  { id: 'log-5', student_id: 'student-5', student_name: 'Vikram Singh', type: 'check_out', method: 'qr', timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() },
  { id: 'log-6', student_id: 'student-1', student_name: 'Arjun Sharma', type: 'check_out', method: 'face', timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() },
  { id: 'log-7', student_id: 'student-2', student_name: 'Kavya Reddy', type: 'check_out', method: 'qr', timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString() },
]

export const mockAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Hostel Day Celebration',
    content: 'Annual Hostel Day will be celebrated on March 25, 2024. All students are expected to participate. Cultural events and competitions will be held.',
    author: 'Dr. Priya Nair',
    target_role: 'student',
    created_at: '2024-03-20T09:00:00Z',
    is_urgent: false,
  },
  {
    id: 'ann-2',
    title: '⚠️ Water Supply Interruption',
    content: 'Water supply will be interrupted on March 22, 2024 from 10 AM to 2 PM due to maintenance work. Please store sufficient water.',
    author: 'Admin',
    target_role: 'all',
    created_at: '2024-03-21T08:00:00Z',
    is_urgent: true,
  },
  {
    id: 'ann-3',
    title: 'Fee Payment Deadline',
    content: 'Last date for March hostel fee payment is March 31, 2024. Students with unpaid fees will face restrictions. Pay via the portal.',
    author: 'Admin',
    target_role: 'student',
    created_at: '2024-03-18T10:00:00Z',
    is_urgent: true,
  },
  {
    id: 'ann-4',
    title: 'New Mess Menu',
    content: 'Updated weekly mess menu has been uploaded. Special Sunday dinners will now include pizza and pasta every alternate week.',
    author: 'Dr. Priya Nair',
    target_role: 'student',
    created_at: '2024-03-15T11:00:00Z',
    is_urgent: false,
  },
]

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    user_id: 'student-1',
    title: 'Outpass Approved',
    message: 'Your outpass request for March 15 has been approved by the warden.',
    type: 'success',
    is_read: false,
    created_at: '2024-03-14T15:00:00Z',
  },
  {
    id: 'notif-2',
    user_id: 'student-1',
    title: 'Fee Reminder',
    message: 'Your hostel fee of ₹25,000 is due on March 31, 2024. Please pay on time.',
    type: 'warning',
    is_read: false,
    created_at: '2024-03-20T09:00:00Z',
  },
  {
    id: 'notif-3',
    user_id: 'student-1',
    title: 'Complaint Update',
    message: 'Your complaint #COMP-001 about water leakage is now in progress. Plumber assigned.',
    type: 'info',
    is_read: true,
    created_at: '2024-03-11T10:00:00Z',
  },
  {
    id: 'notif-4',
    user_id: 'student-1',
    title: 'Attendance Alert',
    message: 'Your attendance has dropped below 85%. Please ensure regular presence.',
    type: 'warning',
    is_read: false,
    created_at: '2024-03-19T08:00:00Z',
  },
]

export const mockMealBookings: MealBooking[] = [
  { id: 'mb-1', student_id: 'student-1', date: new Date().toISOString().split('T')[0], meal_type: 'breakfast', status: 'booked' },
  { id: 'mb-2', student_id: 'student-1', date: new Date().toISOString().split('T')[0], meal_type: 'lunch', status: 'booked' },
  { id: 'mb-3', student_id: 'student-1', date: new Date(Date.now() + 86400000).toISOString().split('T')[0], meal_type: 'breakfast', status: 'booked' },
]

export const weeklyAttendanceData = [
  { day: 'Mon', present: 45, absent: 5, leave: 2 },
  { day: 'Tue', present: 48, absent: 3, leave: 1 },
  { day: 'Wed', present: 42, absent: 7, leave: 3 },
  { day: 'Thu', present: 50, absent: 2, leave: 0 },
  { day: 'Fri', present: 44, absent: 6, leave: 2 },
  { day: 'Sat', present: 38, absent: 8, leave: 6 },
  { day: 'Sun', present: 35, absent: 5, leave: 12 },
]

export const monthlyPaymentData = [
  { month: 'Oct', collected: 180000, pending: 45000 },
  { month: 'Nov', collected: 195000, pending: 30000 },
  { month: 'Dec', collected: 210000, pending: 15000 },
  { month: 'Jan', collected: 225000, pending: 25000 },
  { month: 'Feb', collected: 200000, pending: 50000 },
  { month: 'Mar', collected: 175000, pending: 75000 },
]

export const occupancyData = [
  { name: 'Occupied', value: 42, color: '#00d4ff' },
  { name: 'Available', value: 15, color: '#a855f7' },
  { name: 'Maintenance', value: 3, color: '#f59e0b' },
]

export const attendanceTrendData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date()
  date.setDate(date.getDate() - (29 - i))
  return {
    date: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    attendance: Math.floor(Math.random() * 15 + 80),
  }
})
