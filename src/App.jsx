import { useState } from 'react'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import { getSession } from './components/API'

function App() {
  const [session, setSession] = useState(getSession())

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>

      <div className="relative min-h-screen p-8">
        <header className="max-w-5xl mx-auto flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <img src="/flame-icon.svg" alt="Flames" className="w-10 h-10" />
            <h1 className="text-2xl font-bold text-white tracking-tight">HRMS</h1>
          </div>
        </header>

        <main className="max-w-5xl mx-auto">
          {!session ? (
            <div className="max-w-md mx-auto"><Auth onLoggedIn={setSession} /></div>
          ) : (
            <Dashboard />
          )}
        </main>

        {!session && (
          <footer className="max-w-5xl mx-auto mt-10 text-center">
            <p className="text-sm text-blue-300/60">Sign in as superadmin to manage users and departments, or as employee to view profile, apply leave and view payslips.</p>
          </footer>
        )}
      </div>
    </div>
  )
}

export default App