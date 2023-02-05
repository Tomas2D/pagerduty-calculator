import { getDaysInMonth } from '@app/helpers/date'
import { fetchPagerDuty, parseContent } from '@app/services/api'
import {
  createSummaryFactory,
  filterCurrentMonthDatesFactory,
  fixDateFormatFactory,
  groupDatesFactory,
} from '@app/services/parser'
import { filter, map, pipe } from 'ramda'
import { Options } from '@app/types'
import { configSchema } from '@app/config'

export async function getStats(options: Options) {
  options = configSchema.parse(options)
  const content = await fetchPagerDuty({
    ...options.api,
    from: options.dates.start,
    to: options.dates.end,
  })

  const currentMonthIndex = options.dates.start.getMonth()
  const daysInMonth = getDaysInMonth(options.dates.start)

  return pipe(
    parseContent(options.nicknames),
    filter(filterCurrentMonthDatesFactory(currentMonthIndex)),
    map(fixDateFormatFactory(currentMonthIndex)),
    groupDatesFactory({
      currentMonthIndex,
      holidays: options.dates.holidays,
      work: options.work,
    }),
    createSummaryFactory(daysInMonth),
  )(content)
}
