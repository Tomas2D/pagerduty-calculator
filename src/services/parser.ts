import {
  diffDateHours,
  formatDate,
  incrementDate,
  isInSameMonth,
  setEndOfTheDay,
  setStartOfTheDay,
} from '@app/helpers/date'
import { APIResponseItem, GroupedResult, Options, Output } from '@app/types'

export function filterCurrentMonthDatesFactory(currentMonthIndex: number) {
  return function filterCurrentMonthDates(row: APIResponseItem) {
    return (
      isInSameMonth(row.start.getMonth(), currentMonthIndex) ||
      isInSameMonth(row.end.getMonth(), currentMonthIndex)
    )
  }
}

export function fixDateFormatFactory(currentMonthIndex: number) {
  return function fixDateFormat(row: APIResponseItem) {
    if (row.start.getMonth() !== currentMonthIndex && row.end.getMonth() === currentMonthIndex) {
      row.start.setDate(1)
      row.start.setMonth(row.end.getMonth())
      setStartOfTheDay(row.start)
      return row
    }

    if (row.start.getMonth() === currentMonthIndex && row.end.getMonth() !== currentMonthIndex) {
      if (row.end.getMonth() === row.start.getMonth()) {
        setEndOfTheDay(row.end)
      } else {
        while (row.end.getMonth() !== row.start.getMonth()) {
          row.end = incrementDate(row.end, -1)
          if (row.end.getMonth() === row.start.getMonth()) {
            row.end = incrementDate(row.end, 1)
            setStartOfTheDay(row.end)
            break
          }
        }
      }
    }

    return row
  }
}

export function groupDatesFactory(options: {
  currentMonthIndex: number
  holidays: Date[]
  work: Options['work']
}) {
  const workTotal = Math.max(options.work.end - options.work.start, 0)

  function* iterateDate({ from, to, incrementBy }: { from: Date; to: Date; incrementBy?: number }) {
    const increaseBy = Math.abs(incrementBy ?? 1)

    let isFirst = true

    const toForFinish = new Date(to)
    setEndOfTheDay(toForFinish)

    for (
      let current = from;
      current.getTime() < toForFinish.getTime();
      current.setDate(current.getDate() + increaseBy)
    ) {
      const date = new Date(current)

      if (isFirst) {
        isFirst = false
      } else {
        setStartOfTheDay(date)
      }

      const isWeekend = [0, 6].includes(date.getDay())
      const isHoliday = options.holidays.map(formatDate).includes(formatDate(date))
      let hours = 0

      // On-call changes that date
      if (date.getDate() === to.getDate()) {
        hours = diffDateHours(date, to)

        // Check timezone
        const diffTimezoneHours = (to.getTimezoneOffset() - date.getTimezoneOffset()) / 60
        if (diffTimezoneHours) {
          hours -= diffTimezoneHours
        }

        if (!isWeekend && !isHoliday) {
          if (hours === 24) {
            hours = 24 - workTotal
          } else {
            const diffWorkingTime = Math.max(
              0,
              Math.min(options.work.end, to.getHours()) -
                Math.max(options.work.start, date.getHours()),
            )

            hours -= diffWorkingTime
          }
        }
      } else {
        // On-call stay same for today
        hours = 24 - date.getHours()

        if (!isWeekend && !isHoliday) {
          if (hours === 24) {
            hours = 24 - workTotal
          } else {
            const diffWorkingTime = Math.max(
              0,
              options.work.end - Math.max(options.work.start, date.getHours()),
            )

            hours -= diffWorkingTime
          }
        }
      }

      yield {
        date,
        hours,
        isWeekend,
        isHoliday,
      }
    }
  }

  return (row: APIResponseItem[]) =>
    row.reduce<GroupedResult[]>(function groupResults(results, row) {
      for (const { date, hours, isHoliday, isWeekend } of iterateDate({
        from: row.start,
        to: row.end,
      })) {
        if (date.getMonth() !== options.currentMonthIndex) {
          continue
        }

        results.push({
          date: formatDate(date),
          dateInstance: date,
          hours: Math.max(Math.floor(hours), 0),
          person: row.person,
          isHoliday,
          isWeekend,
        })
      }
      return results
    }, [])
}

export function createSummaryFactory(daysInMonth: number) {
  return (rows: GroupedResult[]): Output =>
    rows.reduce(
      function createSummary(result, { date, dateInstance, hours, person, isHoliday, isWeekend }) {
        if (!result.people.has(person)) {
          result.people.set(person, Array(daysInMonth).fill(0))
        }
        result.people.get(person)![dateInstance.getDate() - 1] += hours

        if (!result.days.has(date)) {
          result.days.set(date, { date, dateInstance, isHoliday, isWeekend })
        }

        result.weekDays += Number(isWeekend)
        result.holidays += Number(isHoliday)
        result.workingDays += Number(!isWeekend && !isHoliday)
        return result
      },
      {
        days: new Map(),
        people: new Map(),
        weekDays: 0,
        workingDays: 0,
        holidays: 0,
      },
    )
}
