export interface APIOptions {
  /**
   * Your PagerDuty domain
   * @example https://company.pagerduty.com
   */
  domain: string
  /**
   * Timezone, should be same as your local one.
   * @example Europe/Prague
   */
  timeZone: string
  teamIds: string[]
  from: Date
  to: Date
  /**
   * @example {
   *   headers: {
   *    Authorization: 'Token token=YOUR_PAGERDUTY_TOKEN',
   *   }
   * }
   */
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
  api: Omit<APIOptions, 'from' | 'to'>
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
