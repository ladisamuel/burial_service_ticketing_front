import React, { useState } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Input from '../components/ui/Input.jsx'
import Button from '../components/ui/Button.jsx'
import Badge from '../components/ui/Badge.jsx'
import api from '../api/axios.js'

const schema = Yup.object({
  reference: Yup.string().required('Reference number is required'),
})

export default function LookupPage() {
  const [result, setResult] = useState(null)
  const navigate = useNavigate()
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await api.get('/tickets/lookup/?reference=' + values.reference)
      setResult(res.data)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Ticket not found.')
      setResult(null)
    } finally {
      setSubmitting(false)
    }
  }

  const statusConfig = {
    PENDING: { variant: 'warning', border: 'border-amber-300', text: 'Your request is pending review. We will notify you by email.' },
    APPROVED: { variant: 'success', border: 'border-emerald-300', text: 'Your ticket has been approved.' },
    DECLINED: { variant: 'danger', border: 'border-rose-300', text: 'We regret to inform you that your request could not be accommodated.' },
  }

  const resultBorder = result ? (statusConfig[result.status]?.border || 'border-slate-200') : 'border-slate-200'

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="mx-auto max-w-lg">
        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl md:text-3xl text-slate-800 mb-2">
            Check Ticket Status
          </h1>
          <p className="text-slate-500">
            Enter your reference number to check the status of your request.
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
          <Formik
            initialValues={{ reference: '' }}
            validationSchema={schema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
              <Form className="space-y-5">
                <Input
                  label="Reference Number *"
                  name="reference"
                  placeholder="REF-XXXX"
                  value={values.reference}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.reference && errors.reference}
                />
                <Button type="submit" isLoading={isSubmitting} className="w-full">
                  Check Status
                </Button>
              </Form>
            )}
          </Formik>
        </div>

        {result && (
          <div className={'mt-6 bg-white rounded-xl border-2 ' + resultBorder + ' shadow-sm p-6'}>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant={statusConfig[result.status]?.variant || 'default'}>
                {result.status}
              </Badge>
            </div>
            <p className="text-slate-700 mb-4">
              {statusConfig[result.status]?.text}
            </p>
            <p className="text-slate-700 mb-4">
              
          <button
            onClick={() => navigate(`/ticket/${result.reference}`)}
            className="px-4 py-2 bg-[#B4652F] text-white rounded-lg text-xs tracking-[0.15em] uppercase hover:bg-[#8A7F6A] transition-colors"
          >
            View ticket here
          </button>
            </p>
            {result.status === 'APPROVED' && result.ticket_number && (
              <div className="space-y-3">
                <p className="font-mono text-lg font-semibold text-slate-800">
                  Ticket: {result.ticket_number}
                </p>
                <Link to={'/ticket/' + result.ticket_number}>
                  <Button>View Ticket</Button>
                </Link>
              </div>
            )}
            {result.status === 'DECLINED' && result.notes && (
              <p className="text-sm text-slate-500 mt-2">
                Note: {result.notes}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
