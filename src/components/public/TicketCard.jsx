import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../ui/Button.jsx'

export default function TicketCard() {
  return (
    <section className="py-12 px-4 bg-slate-100">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="font-serif text-2xl md:text-3xl text-slate-800 mb-4">
          Attend the Service
        </h2>
        <p className="text-slate-600 mb-6">
          We would be honored by your presence. Please request a ticket to help us
          manage seating arrangements.
        </p>
        <Link to="/request-ticket">
          <Button size="lg">
            <i className="pi pi-ticket mr-2" />
            Request a Ticket to Attend
          </Button>
        </Link>
      </div>
    </section>
  )
}
