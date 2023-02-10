import { APIOptions, APIResponseItem } from '@app/types'
import { formatDate } from '@app/helpers/date'

export async function fetchPagerDuty(params: APIOptions) {
  const url = new URL(params.domain)
  url.pathname = '/api/v1/schedules'
  url.searchParams.append('include[]', 'final_schedule')
  url.searchParams.append('include[]', 'oncall')
  url.searchParams.set('limit', '5000')
  url.searchParams.set('offset', '0')
  url.searchParams.set('time_zone', params.timeZone)
  url.searchParams.set('since', formatDate(params.from))
  url.searchParams.set('until', formatDate(params.to))
  params.teamIds.forEach((teamId) => {
    url.searchParams.append('team_ids[]', teamId)
  })

  return fetch(url, params.fetchOptions).then((response) => {
    if (!response.ok) {
      throw new Error('Failed to fetch data from PagerDuty!')
    }
    return response.json()
  })
}

export function parseContent(nickNames: Record<string, string> = {}) {
  return function parse(content: Awaited<ReturnType<typeof fetchPagerDuty>>): APIResponseItem[] {
    return content.schedules[0].final_schedule.rendered_schedule_entries.map(
      (entry: Record<string, any>) => ({
        start: new Date(entry.start),
        end: new Date(entry.end),
        person: nickNames[entry.user.summary] ?? entry.user.summary,
      }),
    )
  }
}
