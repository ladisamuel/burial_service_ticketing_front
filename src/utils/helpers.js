// export function cn(...classes) {
//   return classes.filter(Boolean).join(' ')
// }

// export function formatDate(dateStr) {
//   if (!dateStr) return ''
//   console.log("dateStr", dateStr)
//   const { format, parseISO } = require('date-fns')
//   try {
//     return format(parseISO(dateStr), 'MMMM d, yyyy')
//   } catch {
//     return dateStr
//   }
// }

// export function formatTime(timeStr) {
//   if (!timeStr) return ''
//   const { format, parseISO } = require('date-fns')
//   try {
//     return format(parseISO(timeStr), 'h:mm a')
//   } catch {
//     return timeStr
//   }
// }

// export function formatDateTime(iso) {
//   if (!iso) return ''
//   const { format, parseISO } = require('date-fns')
//   try {
//     return format(parseISO(iso), "MMMM d, yyyy 'at' h:mm a")
//   } catch {
//     return iso
//   }
// }


import { format, parseISO } from 'date-fns'

export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(dateStr) {
  if (!dateStr) return ''

  console.log('dateStr', dateStr)

  try {
    return format(parseISO(dateStr), 'MMMM d, yyyy')
  } catch {
    return dateStr
  }
}

export function formatTime(timeStr) {
  if (!timeStr) return ''

  try {
    return format(parseISO(timeStr), 'h:mm a')
  } catch {
    return timeStr
  }
}

export function formatDateTime(iso) {
  if (!iso) return ''

  try {
    return format(parseISO(iso), "MMMM d, yyyy 'at' h:mm a")
  } catch {
    return iso
  }
}