export interface APIOptions {
  domain: string
  timeZone: string
  teamIds: string[]
  from: Date
  to: Date
  fetchOptions?: RequestInit
}

export interface APIResponseItem {
  start: Date
  end: Date
  person: string
}

export interface Options {
  nicknames?: Record<string, string>
  work: {
    start: number
    end: number
  }
  dates: {
    start: Date
    end: Date
    holidays: Date[]
  }
  api: Omit<APIOptions, 'from' | 'to' | 'fetchOptions'>
}

export interface GroupedResult {
  date: string
  dateInstance: Date
  hours: number
  person: string
  isHoliday: boolean
  isWeekend: boolean
}

export type OutputPerson = number[]
export interface OutputDay {
  date: string
  dateInstance: Date
  isHoliday: boolean
  isWeekend: boolean
}

export interface Output {
  days: Map<string, OutputDay>
  people: Map<string, OutputPerson>
  weekDays: number
  workingDays: number
  holidays: number
}
