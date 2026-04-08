'use client'
import { useState, useEffect } from 'react'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import { Check, X, Eye, RefreshCw, Shield } from 'lucide-react'

export default function AdminPage() {
  const [secret, setSecret] = useState('')
  const [authed, setAuthed] = useState(false)
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('pending')
  const [note, setNote] = useState('')
  const [processing, setProcessing] = useState<string | null>(null)

  const fetchPayments = async () => {
    setLoading(true)
    const res = await fetch(`/api/admin?status=${filter}`, {
      headers: { 'x-admin-secret': secret }
    })
    if (!res.ok) { toast.error('Auth failed'); setAuthed(false); setLoading(false); return }
    const data = await res.json()
    setPayments(data.data || [])
    setLoading(false)
  }

  useEffect(() => { if (authed) fetchPayments() }, [filter, authed])

  const handleAction = async (paymentId: string, action: 'approve' | 'reject') => {
    setProcessing(paymentId)
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
      body: JSON.stringify({ paymentId, action, adminNote: note })
    })
    const data = await res.json()
    if (res.ok) {
      toast.success(data.message)
      fetchPayments()
    } else {
      toast.error(data.error)
    }
    setProcessing(null)
    setNote('')
  }

  if (!authed) return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <div className="glass rounded-2xl p-8 w-full max-w-sm text-center">
        <Shield className="w-12 h-12 text-gold-400 mx-auto mb-4" />
        <h1 className="text-white font-display text-2xl font-bold mb-6">Admin Access</h1>
        <input
          type="password"
          className="input-dark text-center mb-4"
          placeholder="Enter admin secret"
          value={secret}
          onChange={e => setSecret(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') setAuthed(true) }}
        />
        <button onClick={() => setAuthed(true)} className="btn-gold w-full py-3">Enter Admin Panel</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-dark-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold text-white">Admin Panel</h1>
          <button onClick={fetchPayments} className="btn-ghost flex items-center gap-2 text-sm py-2 px-4">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-6">
          {['pending', 'approved', 'rejected'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm capitalize transition-all ${
                filter === f ? 'bg-gold-gradient text-dark-900 font-semibold' : 'glass text-white/50 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-white/30">Loading...</div>
        ) : payments.length === 0 ? (
          <div className="text-center py-16 glass rounded-2xl text-white/30">
            No {filter} payments found.
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map(p => (
              <div key={p.id} className="glass rounded-2xl p-5">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
                  <div className="md:col-span-2">
                    <p className="text-white font-medium">{p.profiles?.email}</p>
                    <p className="text-white/40 text-sm">{p.profiles?.full_name}</p>
                    <p className="text-white/30 text-xs mt-1">{formatDate(p.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-gold-400 font-semibold">₹{p.amount} — {p.plan}</p>
                    <p className="text-white/50 text-sm">{p.credits_to_add.toLocaleString()} credits</p>
                    {p.utr_number && <p className="text-white/30 text-xs font-mono mt-1">UTR: {p.utr_number}</p>}
                  </div>
                  <div>
                    {p.screenshot_url && (
                      <a href={p.screenshot_url} target="_blank" className="flex items-center gap-1 text-blue-400 text-sm hover:underline">
                        <Eye className="w-4 h-4" /> View Screenshot
                      </a>
                    )}
                    <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                      p.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      p.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                  {p.status === 'pending' && (
                    <div className="flex flex-col gap-2">
                      <input
                        className="input-dark text-xs py-1.5"
                        placeholder="Admin note (optional)"
                        value={note}
                        onChange={e => setNote(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(p.id, 'approve')}
                          disabled={processing === p.id}
                          className="flex-1 flex items-center justify-center gap-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg py-2 text-xs hover:bg-green-500/30 transition-all disabled:opacity-50"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => handleAction(p.id, 'reject')}
                          disabled={processing === p.id}
                          className="flex-1 flex items-center justify-center gap-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg py-2 text-xs hover:bg-red-500/30 transition-all disabled:opacity-50"
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
