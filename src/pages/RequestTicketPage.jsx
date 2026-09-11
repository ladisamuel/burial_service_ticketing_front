import React, { useEffect, useState } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useRecoilState, useRecoilValue } from 'recoil'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { bookTicketState, eventState } from '../store/atoms.js'
import Input from '../components/ui/Input.jsx'
import Select from '../components/ui/Select.jsx'
import Button from '../components/ui/Button.jsx'
import Badge from '../components/ui/Badge.jsx'
import api from '../api/axios.js'

const schema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string(),
  number_of_guests: Yup.number().min(1, 'At least 1 guest').required(),
  relationship_to_deceased: Yup.string(),
})

export default function RequestTicketPage() {
  const { event } = useRecoilValue(eventState)
  const [ticketBookState, setTicketBookState] = useRecoilState(bookTicketState)
  const [submitted, setSubmitted] = useState(false)
  const [reference, setReference] = useState('')

  const navigate = useNavigate()

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await api.post('/tickets/request/', values)
      if (res?.data?.reference) {
        setSubmitted(true)
        toast.success('Ticket request submitted successfully.')
        setReference(res?.data?.reference)
        setTicketBookState({reference: res?.data?.reference})
        localStorage.setItem('reference', res?.data?.reference)

      }
    } catch (err) {
      if (err.response?.data?.email) {
        toast.error(err.response?.data?.email[0] || 'Failed to submit request.')
      } else {
        toast.error(err.response?.data?.detail || 'Failed to submit request.')
      }
    } finally {
      setSubmitting(false)
    }
  }
 

useEffect(() => {
  const savedReference = localStorage.getItem('reference')

  console.log('ticketBookState', ticketBookState)
  console.log('savedReference', savedReference)
  if (savedReference) {
  // http://localhost:5173/ticket/TICK-S8YF30
    navigate(`/ticket/${savedReference}`,)
    // navigate(`/ticket/${savedReference}`, { replace: true })
  }
}, [navigate])

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 md:p-12 max-w-lg w-full text-center">
          <i className="pi pi-check-circle text-5xl text-emerald-500 mb-6" />
          <h1 className="font-serif text-2xl text-slate-800 mb-4">
            Request Received
          </h1>
          <p className="text-slate-600 mb-6">
            Your request has been submitted. You will receive an email once your
            request is reviewed.
          </p>
          <div className="bg-slate-100 rounded-lg p-4 mb-6">
            <p className="text-sm text-slate-500 mb-1">Reference Number</p>
            <p className="text-2xl font-mono font-bold text-slate-800 tracking-wider">
              {reference}
            </p>
          </div>
          <Link to="/lookup">
            <Button variant="outline">Check Ticket Status</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="mx-auto max-w-lg">
        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl md:text-3xl text-slate-800 mb-2">
            Request a Ticket
          </h1>
          <p className="text-slate-500">
            Please fill in your details to request attendance.
          </p>
          {typeof event?.remaining_capacity === 'number' && (
            <div className="mt-3">
              <Badge variant={event.remaining_capacity > 10 ? 'info' : 'warning'}>
                {event.remaining_capacity} seats remaining
              </Badge>
            </div>
          )}
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
          <Formik
            initialValues={{
              name: '',
              email: '',
              phone: '',
              number_of_guests: 1,
              relationship_to_deceased: '',
            }}
            validationSchema={schema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
              <Form className="space-y-5">
                <Input
                  label="Full Name *"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && errors.name}
                />
                <Input
                  label="Email *"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && errors.email}
                />
                <Input
                  label="Phone (optional)"
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Input
                  label="Number of Guests *"
                  name="number_of_guests"
                  type="number"
                  min={1}
                  value={values.number_of_guests}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.number_of_guests && errors.number_of_guests}
                />
                <Input
                  label="Referral/Relationship to Deceased (optional)"
                  name="relationship_to_deceased"
                  value={values.relationship_to_deceased}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Button type="submit" isLoading={isSubmitting} className="w-full">
                  Submit Request
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}
