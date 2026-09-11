import React, { useEffect, useState } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import Input from '../components/ui/Input.jsx'
import Textarea from '../components/ui/Textarea.jsx'
import Button from '../components/ui/Button.jsx'
import api from '../api/axios.js'

const schema = Yup.object({
  subject: Yup.string().required('Subject is required'),
  message: Yup.string().required('Message is required'),
})

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      try {
        const res = await api.get('/admin/announcements/')
        if (!cancelled) setAnnouncements(res.data.results || res.data)
      } catch {
        // silent
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchData()
    return () => { cancelled = true }
  }, [])

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      await api.post('/admin/announcements/', values)
      toast.success('Announcement sent.')
      resetForm()
      const res = await api.get('/admin/announcements/')
      setAnnouncements(res.data.results || res.data)
    } catch {
      toast.error('Failed to send announcement.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-800">Announcements</h1>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Send Announcement</h2>
        <Formik
          initialValues={{ subject: '', message: '' }}
          validationSchema={schema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form className="space-y-5">
              <Input
                label="Subject *"
                name="subject"
                value={values.subject}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.subject && errors.subject}
              />
              <Textarea
                label="Message *"
                name="message"
                rows={5}
                value={values.message}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.message && errors.message}
              />
              <Button type="submit" isLoading={isSubmitting}>
                <i className="pi pi-send mr-2" /> Send to Approved Guests
              </Button>
            </Form>
          )}
        </Formik>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Past Announcements</h2>
        {loading ? (
          <p className="text-slate-400">Loading...</p>
        ) : announcements.length === 0 ? (
          <p className="text-slate-500">No announcements sent yet.</p>
        ) : (
          <div className="space-y-3">
            {announcements.map((a) => (
              <div key={a.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                <h3 className="font-semibold text-slate-800">{a.subject}</h3>
                <p className="text-slate-600 text-sm mt-1 whitespace-pre-wrap">{a.message}</p>
                <p className="text-xs text-slate-400 mt-2">{a.sent_at}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}