import React, { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { toast } from 'react-toastify'
import { tributeState } from '../../store/atoms.js'
import Badge from '../ui/Badge.jsx'
import { formatDateTime } from '../../utils/helpers.js'
import api from '../../api/axios.js'

export default function TributesWall() {
  const [tributeStateValue, setTributeState] = useRecoilState(tributeState)

  useEffect(() => {
    let cancelled = false
    const fetchTributes = async () => {
      setTributeState((prev) => ({ ...prev, loading: true }))
      try {
        const res = await api.get('/tributes/')
        if (!cancelled) {
          setTributeState((prev) => ({
            ...prev,
            tributes: res.data.results || res.data,
            loading: false,
          }))
        }
      } catch (err) {
        if (!cancelled) {
          setTributeState((prev) => ({ ...prev, loading: false }))
          toast.error('Failed to load tributes.')
        }
      }
    }
    fetchTributes()
    return () => { cancelled = true }
  }, [setTributeState])

  const tributes = tributeStateValue.tributes

  return (
    <section className="py-12 px-4">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-serif text-2xl md:text-3xl text-slate-800 text-center mb-8">
          Tributes & Memories
        </h2>
        {tributeStateValue.loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-40 bg-slate-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : tributes.length === 0 ? (
          <div className="text-center py-12">
            <i className="pi pi-heart text-4xl text-slate-300 mb-4" />
            <p className="text-slate-500 text-lg">
              Be the first to share a memory.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tributes.map((tribute) => (
              <div
                key={tribute.id}
                className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 border-l-4 border-l-amber-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-800">{tribute.name}</h3>
                  {tribute.relationship && (
                    <Badge variant="default">{tribute.relationship}</Badge>
                  )}
                </div>
                <p className="text-slate-600 leading-relaxed mb-4">
                  {tribute.message}
                </p>
                <p className="text-xs text-slate-400">
                  {formatDateTime(tribute.created_at)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
