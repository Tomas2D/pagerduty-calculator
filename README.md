# 🥱 PageDuty calculator

The library for calculating the total number of on-call hours for individuals per month (PagerDuty).


## 🚀 Installation

```shell
npm install pagerduty-calculator
```

```shell
yarn add pagerduty-calculator
```

## 🤘🏻 Usage

```typescript
import { getStats } from 'pagerduty-calculator'

const results = await getStats({
  api: {
    domain: 'organization.pagerduty.com',
    teamIds: ['XXXXXX'],
    timeZone: 'Europe/Prague',
    fetchOptions: {
      headers: {
        'Authorization': 'Token token=YOUR_PAGEDUTY_TOKEN',
      },
    },
  },
  // Specify your work hours, they will be excluded from the calculation
  work: {
    start: 9, 
    end: 17,
  },
  dates: {
    start: new Date('2023-01-01'),
    // The end should be start of next month!
    end: new Date('2023-02-01'),
    // Optional
    holidays: [
      new Date('2023-01-01')
    ],
  },
  nicknames: {
    'Person A': 'Alex',
    'Person B': 'Luigi',
    'Person C': 'Tomas',
  },
})
```

### Example response
```json
{
  "totalDays": 31,
  "holidays": 1,
  "weekDays": 9,
  "workingDays": 22,
  "days": Map {
    "2023-01-01" => {
        "date": "2023-01-01",
        "dateInstance": 2022-12-31T23:00:00.000Z,
        "isHoliday": true,
        "isWeekend": true,
    },
    "2023-01-02" => {
        "date": "2023-01-02",
        "dateInstance": 2023-01-01T23:00:00.000Z,
        "isHoliday": false,
        "isWeekend": false,
    },
    ...
  },
  "people": Map {
    /* Size of each array is number of days in given month */
    "Alex" => [9, 0, 0, 0, ...],
    "Luigi" => [15, 16, 16, 9, ...]
    "Tomas" => [0, 0, 0, 7, ...]
  }
}
```
