import React, { useEffect } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { toast } from 'react-toastify'
import { authState } from '../store/atoms.js'
import Input from '../components/ui/Input.jsx'
import Button from '../components/ui/Button.jsx'
import api from '../api/axios.js'

const schema = Yup.object({
  email: Yup.string().required('Email is required'),
  password: Yup.string().required('Password is required'),
})

export default function AdminLoginPage() {
  const [auth, setAuth] = useRecoilState(authState)
  const navigate = useNavigate()

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate('/admin')
    }
  }, [auth.isAuthenticated, navigate])

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await api.post('/auth/login/', values)
      localStorage.setItem('access_token', res.data.access)
      localStorage.setItem('refresh_token', res.data.refresh)
      setAuth({
        accessToken: res.data.access,
        refreshToken: res.data.refresh,
        user: res.data.user || { email: values.email },
        isAuthenticated: true,
      })
      toast.success('Welcome back!')
      navigate('/admin')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Invalid credentials.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 md:p-10 max-w-sm w-full">
        <div className="text-center mb-8">
          <i className="pi pi-lock text-4xl text-amber-600 mb-4" />
          <h1 className="text-2xl font-bold text-slate-800">Admin Login</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to manage the event</p>
        </div>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={schema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form className="space-y-5">
              <Input
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && errors.email}
              />
              <Input
                label="Password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && errors.password}
              />
              <Button type="submit" isLoading={isSubmitting} className="w-full">
                Sign In
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}
