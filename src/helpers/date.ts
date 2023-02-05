export function formatDate(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-')
}

export function incrementDate(dateInput: Date, daysCount: number): Date {
  return new Date(new Date(dateInput).getTime() + daysCount * 86400000)
}

export function diffDateHours(startDate: Date, endDate: Date) {
  return (endDate.getTime() - startDate.getTime()) / 1000 / 60 / 60
}

export function getDaysInMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

export function setEndOfTheDay(date: Date) {
  date.setHours(23, 59, 59, 0)
}
export function setStartOfTheDay(date: Date) {
  date.setHours(0, 0, 0, 0)
}

export function isInSameMonth(monthIndexA: number, monthIndexB: number) {
  return monthIndexA === monthIndexB
}
