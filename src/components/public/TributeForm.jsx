import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useRecoilState } from 'recoil'
import { toast } from 'react-toastify'
import Input from '../ui/Input.jsx'
import Textarea from '../ui/Textarea.jsx'
import Button from '../ui/Button.jsx'
import { tributeState } from '../../store/atoms.js'
import api from '../../api/axios.js'

const schema = Yup.object({
  name: Yup.string().required('Your name is required'),
  email: Yup.string().email('Invalid email'),
  referral: Yup.string(),
  relationship: Yup.string(),
  message: Yup.string().required('Please share a memory or message'),
})

export default function TributeForm() {
  const [tributeStateValue, setTributeState] = useRecoilState(tributeState)

  const handleSubmit = async (values, { resetForm }) => {
    setTributeState((prev) => ({ ...prev, submitting: true }))
    try {
      const res = await api.post('/tributes/admin/tribute/', values)
      setTributeState((prev) => ({
        ...prev,
        tributes: [res.data, ...prev.tributes],
        submitting: false,
      }))
      toast.success('Your tribute has been shared.')
      resetForm()
    } catch (err) {
      setTributeState((prev) => ({ ...prev, submitting: false }))
      toast.error(err.response?.data?.detail || 'Failed to submit tribute.')
    }
  }

  return (
    <section className="py-12 px-4">
      <div className="mx-auto max-w-xl">
        <h2 className="font-serif text-2xl md:text-3xl text-slate-800 text-center mb-8">
          Write a tribute or Share a Memory
        </h2>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
          <Formik
            initialValues={{ name: '', email: '', referral: '', relationship: '', message: '' }}
            validationSchema={schema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
              <Form className="space-y-5">
                <Input
                  label="Your Name *"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && errors.name}
                />
                <Input
                  label="Email (optional)"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && errors.email}
                />
                <Input
                  label="Referal (optional)"
                  name="referral"
                  placeholder="e.g. Oluwatosin Ladipo"
                  value={values.referral}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.referral && errors.referral}
                />
                <Input
                  label="Relationship (optional)"
                  name="relationship"
                  placeholder="e.g. Family, Friend, Colleague"
                  value={values.relationship}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.relationship && errors.relationship}
                />
                <Textarea
                  label="Your Message *"
                  name="message"
                  placeholder="Share a fond memory, a story, or words of comfort..."
                  value={values.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.message && errors.message}
                />
                <Button
                  type="submit"
                  isLoading={isSubmitting || tributeStateValue.submitting}
                  className="w-full"
                >
                  Submit Tribute
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </section>
  )
}
