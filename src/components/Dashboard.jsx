import { useEffect, useState } from 'react'
import { endpoints, getSession, setSession } from './API'

function Section({ title, children }){
  return (
    <div className="bg-white/10 rounded-xl border border-white/10 p-5">
      <h3 className="text-white font-semibold mb-3">{title}</h3>
      {children}
    </div>
  )
}

export default function Dashboard(){
  const [session, setSess] = useState(getSession())
  const [users, setUsers] = useState([])
  const [deps, setDeps] = useState([])
  const [emp, setEmp] = useState(null)
  const [leaves, setLeaves] = useState([])
  const [payslips, setPayslips] = useState([])
  const [message, setMessage] = useState('')

  const isAdmin = session?.role === 'superadmin'

  useEffect(()=>{
    if(!session) return
    if(isAdmin){
      endpoints.listUsers().then(setUsers).catch(console.error)
      endpoints.listDepartments().then(setDeps).catch(console.error)
    }
    endpoints.getEmployee(session.user_id).then(setEmp).catch(()=>{})
    endpoints.listLeaves(session.user_id).then(setLeaves).catch(()=>{})
    endpoints.listPayslips(session.user_id).then(setPayslips).catch(()=>{})
  },[session])

  const handleCreateUser = async(e)=>{
    e.preventDefault()
    const fd = new FormData(e.target)
    const payload = Object.fromEntries(fd.entries())
    try{
      await endpoints.createUser(payload)
      setMessage('User created')
      const list = await endpoints.listUsers(); setUsers(list)
      e.target.reset()
    }catch(err){ setMessage(err.message) }
  }

  const handleCreateDept = async(e)=>{
    e.preventDefault()
    const fd = new FormData(e.target)
    const payload = Object.fromEntries(fd.entries())
    try{
      await endpoints.createDepartment(payload)
      setMessage('Department created')
      const list = await endpoints.listDepartments(); setDeps(list)
      e.target.reset()
    }catch(err){ setMessage(err.message) }
  }

  const handleUpdateProfile = async(e)=>{
    e.preventDefault()
    const fd = new FormData(e.target)
    const payload = {
      designation: fd.get('designation') || undefined,
      department_id: fd.get('department_id') || undefined,
      work_email: fd.get('work_email') || undefined,
      phone: fd.get('phone') || undefined,
      address: fd.get('address') || undefined,
      bank: {
        account_holder: fd.get('account_holder') || undefined,
        account_number: fd.get('account_number') || undefined,
        ifsc: fd.get('ifsc') || undefined,
        bank_name: fd.get('bank_name') || undefined,
        branch: fd.get('branch') || undefined,
      },
      statutory: {
        pf_number: fd.get('pf_number') || undefined,
        uan: fd.get('uan') || undefined,
        esi_number: fd.get('esi_number') || undefined,
        pan: fd.get('pan') || undefined,
      },
      salary: {
        basic: parseFloat(fd.get('basic')||0),
        hra: parseFloat(fd.get('hra')||0),
        special_allowance: parseFloat(fd.get('special_allowance')||0),
        other_earnings: parseFloat(fd.get('other_earnings')||0),
        deductions: parseFloat(fd.get('deductions')||0),
      }
    }
    try{
      await endpoints.updateEmployee(session.user_id, payload)
      setMessage('Profile updated')
      const profile = await endpoints.getEmployee(session.user_id); setEmp(profile)
    }catch(err){ setMessage(err.message) }
  }

  const handleApplyLeave = async(e)=>{
    e.preventDefault()
    const fd = new FormData(e.target)
    const payload = {
      start_date: fd.get('start_date'),
      end_date: fd.get('end_date'),
      leave_type: fd.get('leave_type'),
      reason: fd.get('reason')
    }
    try{
      await endpoints.applyLeave(session.user_id, payload)
      const list = await endpoints.listLeaves(session.user_id); setLeaves(list)
      setMessage('Leave applied')
      e.target.reset()
    }catch(err){ setMessage(err.message) }
  }

  const handleGeneratePayslip = async(e)=>{
    e.preventDefault()
    const fd = new FormData(e.target)
    try{
      await endpoints.generatePayslip(session.user_id, parseInt(fd.get('month')), parseInt(fd.get('year')))
      const slips = await endpoints.listPayslips(session.user_id); setPayslips(slips)
      setMessage('Payslip generated')
    }catch(err){ setMessage(err.message) }
  }

  const logout = ()=>{ setSession(null); setSess(null) }

  if(!session){
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-white text-2xl font-bold">Welcome, {session.name}</h2>
        <button onClick={logout} className="text-sm text-white/80 hover:text-white underline">Logout</button>
      </div>
      {message && <div className="text-sm text-amber-200">{message}</div>}

      {isAdmin && (
        <div className="grid md:grid-cols-2 gap-6">
          <Section title="Create User">
            <form onSubmit={handleCreateUser} className="space-y-2">
              <input name="name" placeholder="Name" className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white placeholder-white/40" required />
              <input name="email" placeholder="Email" className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white placeholder-white/40" required />
              <select name="role" className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white">
                <option value="employee">Employee</option>
                <option value="superadmin">Superadmin</option>
              </select>
              <input name="password" type="password" placeholder="Temp Password" className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white placeholder-white/40" required />
              <button className="bg-blue-600 hover:bg-blue-500 text-white rounded px-4 py-2">Create</button>
            </form>
          </Section>

          <Section title="Create Department">
            <form onSubmit={handleCreateDept} className="space-y-2">
              <input name="name" placeholder="Name" className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white placeholder-white/40" required />
              <input name="code" placeholder="Code" className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white placeholder-white/40" required />
              <input name="description" placeholder="Description" className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white placeholder-white/40" />
              <button className="bg-blue-600 hover:bg-blue-500 text-white rounded px-4 py-2">Create</button>
            </form>
          </Section>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Section title="My Profile">
          <form onSubmit={handleUpdateProfile} className="space-y-2">
            <input name="designation" placeholder="Designation" className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white placeholder-white/40" />
            <select name="department_id" className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white">
              <option value="">Select department</option>
              {deps.map(d=> <option key={d._id} value={d._id}>{d.name}</option>)}
            </select>
            <input name="work_email" placeholder="Work Email" className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white placeholder-white/40" />
            <input name="phone" placeholder="Phone" className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white placeholder-white/40" />
            <input name="address" placeholder="Address" className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white placeholder-white/40" />
            <div className="grid grid-cols-2 gap-2">
              <input name="account_holder" placeholder="Account Holder" className="px-3 py-2 rounded bg-white/5 border border-white/10 text-white placeholder-white/40" />
              <input name="account_number" placeholder="Account Number" className="px-3 py-2 rounded bg-white/5 border border-white/10 text-white placeholder-white/40" />
              <input name="ifsc" placeholder="IFSC" className="px-3 py-2 rounded bg-white/5 border border-white/10 text-white placeholder-white/40" />
              <input name="bank_name" placeholder="Bank Name" className="px-3 py-2 rounded bg-white/5 border border-white/10 text-white placeholder-white/40" />
              <input name="branch" placeholder="Branch" className="px-3 py-2 rounded bg-white/5 border border-white/10 text-white placeholder-white/40" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input name="pf_number" placeholder="PF Number" className="px-3 py-2 rounded bg-white/5 border border-white/10 text-white placeholder-white/40" />
              <input name="uan" placeholder="UAN" className="px-3 py-2 rounded bg-white/5 border border-white/10 text-white placeholder-white/40" />
              <input name="esi_number" placeholder="ESI Number" className="px-3 py-2 rounded bg-white/5 border border-white/10 text-white placeholder-white/40" />
              <input name="pan" placeholder="PAN" className="px-3 py-2 rounded bg-white/5 border border-white/10 text-white placeholder-white/40" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <input name="basic" type="number" step="0.01" placeholder="Basic" className="px-3 py-2 rounded bg-white/5 border border-white/10 text-white placeholder-white/40" />
              <input name="hra" type="number" step="0.01" placeholder="HRA" className="px-3 py-2 rounded bg-white/5 border border-white/10 text-white placeholder-white/40" />
              <input name="special_allowance" type="number" step="0.01" placeholder="Special Allowance" className="px-3 py-2 rounded bg-white/5 border border-white/10 text-white placeholder-white/40" />
              <input name="other_earnings" type="number" step="0.01" placeholder="Other Earnings" className="px-3 py-2 rounded bg-white/5 border border-white/10 text-white placeholder-white/40" />
              <input name="deductions" type="number" step="0.01" placeholder="Deductions" className="px-3 py-2 rounded bg-white/5 border border-white/10 text-white placeholder-white/40" />
            </div>
            <button className="bg-blue-600 hover:bg-blue-500 text-white rounded px-4 py-2">Save Profile</button>
          </form>
        </Section>

        <Section title="Apply Leave">
          <form onSubmit={handleApplyLeave} className="space-y-2">
            <input name="start_date" type="date" className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white" required />
            <input name="end_date" type="date" className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white" required />
            <select name="leave_type" className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white">
              <option value="sick">Sick</option>
              <option value="casual">Casual</option>
              <option value="earned">Earned</option>
              <option value="unpaid">Unpaid</option>
            </select>
            <input name="reason" placeholder="Reason" className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white placeholder-white/40" />
            <button className="bg-blue-600 hover:bg-blue-500 text-white rounded px-4 py-2">Submit</button>
          </form>
        </Section>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Section title="My Leaves">
          <ul className="text-white/90 text-sm space-y-1 max-h-48 overflow-auto">
            {leaves.map(l => (
              <li key={l._id} className="flex justify-between">
                <span>{l.leave_type} {l.start_date}→{l.end_date}</span>
                <span className="text-white/60">{l.status}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Payslips">
          <form onSubmit={handleGeneratePayslip} className="flex gap-2 mb-3">
            <input name="month" type="number" min="1" max="12" placeholder="MM" className="px-3 py-2 rounded bg-white/5 border border-white/10 text-white w-24" required />
            <input name="year" type="number" min="2000" max="2200" placeholder="YYYY" className="px-3 py-2 rounded bg-white/5 border border-white/10 text-white w-28" required />
            <button className="bg-blue-600 hover:bg-blue-500 text-white rounded px-4 py-2">Generate</button>
          </form>
          <ul className="text-white/90 text-sm space-y-1 max-h-48 overflow-auto">
            {payslips.map(p => (
              <li key={p._id} className="flex justify-between">
                <span>{String(p.month).padStart(2,'0')}/{p.year}</span>
                <span className="text-white/60">Net: {p.net}</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {isAdmin && (
        <Section title="All Users">
          <ul className="text-white/90 text-sm space-y-1 max-h-64 overflow-auto">
            {users.map(u=> (
              <li key={u._id} className="flex justify-between">
                <span>{u.name} • {u.email}</span>
                <span className="text-white/60">{u.role}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  )
}
