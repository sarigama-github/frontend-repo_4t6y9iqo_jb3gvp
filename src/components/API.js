const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export async function api(path, options = {}) {
  const url = `${API_BASE}${path}`
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  const res = await fetch(url, { ...options, headers })
  if (!res.ok) {
    let msg = `${res.status} ${res.statusText}`
    try {
      const data = await res.json()
      msg = data.detail || data.message || msg
    } catch (_) {}
    throw new Error(msg)
  }
  const ct = res.headers.get('content-type') || ''
  return ct.includes('application/json') ? res.json() : res.text()
}

export const endpoints = {
  login: (email, password) => api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout: (token) => api('/auth/logout?token=' + encodeURIComponent(token), { method: 'POST' }),
  createUser: (payload) => api('/admin/users', { method: 'POST', body: JSON.stringify(payload) }),
  listUsers: () => api('/admin/users'),
  createDepartment: (payload) => api('/admin/departments', { method: 'POST', body: JSON.stringify(payload) }),
  listDepartments: () => api('/admin/departments'),
  getEmployee: (userId) => api(`/employee/${userId}`),
  updateEmployee: (userId, payload) => api(`/employee/${userId}`, { method: 'PUT', body: JSON.stringify(payload) }),
  markAttendance: (userId, payload) => api(`/attendance/${userId}`, { method: 'POST', body: JSON.stringify(payload) }),
  getAttendance: (userId, month, year) => api(`/attendance/${userId}?month=${month||''}&year=${year||''}`),
  applyLeave: (userId, payload) => api(`/leaves/${userId}`, { method: 'POST', body: JSON.stringify(payload) }),
  listLeaves: (userId) => api(`/leaves/${userId}`),
  approveLeave: (leaveId, approverId, status='approved') => api(`/leaves/approve/${leaveId}?approver_id=${approverId}&status=${status}`, { method: 'POST' }),
  generatePayslip: (userId, month, year) => api(`/payroll/generate/${userId}`, { method: 'POST', body: JSON.stringify({ month, year }) }),
  listPayslips: (userId) => api(`/payroll/${userId}`)
}

export function setSession(session) {
  if (session) localStorage.setItem('hrms_session', JSON.stringify(session))
  else localStorage.removeItem('hrms_session')
}

export function getSession() {
  try { return JSON.parse(localStorage.getItem('hrms_session')) } catch { return null }
}
