import { useState } from 'react'
import { endpoints, setSession } from './API'

export default function Auth({ onLoggedIn }) {
  const [email, setEmail] = useState('admin@hrms.local')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await endpoints.login(email, password)
      setSession(res)
      onLoggedIn(res)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="bg-white/10 p-6 rounded-xl border border-white/10">
      <h3 className="text-white text-lg font-semibold mb-4">Sign in</h3>
      <form onSubmit={handleLogin} className="space-y-3">
        <input className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white placeholder-white/40" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white placeholder-white/40" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {error && <p className="text-red-300 text-sm">{error}</p>}
        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded px-4 py-2 transition">Login</button>
      </form>
    </div>
  )
}
