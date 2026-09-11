import { atom } from 'recoil'

export const authState = atom({
  key: 'authState',
  default: {
    accessToken: localStorage.getItem('access_token'),
    refreshToken: localStorage.getItem('refresh_token'),
    user: null,
    isAuthenticated: !!localStorage.getItem('access_token'),
  },
})

export const eventState = atom({
  key: 'eventState',
  default: {
    event: null,
    loading: true,
    error: null,
  },
})

export const tributeState = atom({
  key: 'tributeState',
  default: {
    tributes: [],
    loading: false,
    submitting: false,
  },
})

export const ticketLookupState = atom({
  key: 'ticketLookupState',
  default: {
    ticket: null,
    loading: false,
    error: null,
  },
})

export const adminTicketState = atom({
  key: 'adminTicketState',
  default: {
    tickets: [],
    loading: false,
    totalPages: 1,
    currentPage: 1,
  },
})

export const adminTributeState = atom({
  key: 'adminTributeState',
  default: {
    tickets: [],
    loading: false,
    totalPages: 1,
    currentPage: 1,
  },
})

export const checkInState = atom({
  key: 'checkInState',
  default: {
    lastResult: null,
    recent: [],
    loading: false,
  },
})



export const bookTicketState = atom({
  key: 'bookTicketState',
  default: {
    
    reference: localStorage.getItem('reference'),
  },
})

// reference: cookieStore.set(reference, reference)