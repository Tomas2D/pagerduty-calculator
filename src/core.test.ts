import { Options } from '@app/types'
import { describe, expect, it, vi } from 'vitest'
import { getStats } from '@app/core'
import { sum } from 'ramda'

const Config: Options = {
  nicknames: {
    'Person A': 'Alex',
    'Person B': 'Luigi',
    'Person C': 'Tomas',
  },
  work: {
    start: 9,
    end: 17,
  },
  dates: {
    start: new Date('2023-01-01'),
    end: new Date('2023-02-01'),
    holidays: [new Date('2022-11-17')],
  },
  api: {
    domain: 'https://test.pagerduty.com',
    timeZone: 'Europe/Prague',
    teamIds: ['XXXXXX'],
  },
}

describe('Core module', () => {
  it('shell retrieve results', async () => {
    vi.spyOn(global, 'fetch').mockImplementationOnce(
      async () =>
        new Response(
          JSON.stringify({
            'schedules': [
              {
                'id': 'P11ABCD',
                'type': 'schedule',
                'summary': 'My Team - oncall',
                'self': 'https://api.pagerduty.com/schedules/P11ABCD',
                'html_url': 'https://test.pagerduty.com/schedules/P11ABCD',
                'name': 'My Team - oncall',
                'time_zone': 'Europe/Prague',
                'description': null,
                'web_cal_url':
                  'webcal://test.pagerduty.com/private/748c2b3799de1a67dd83c864d7695f76179064f7e8c641e58e5d5ac3ab5ef55f2/feed/P11ABCD',
                'http_cal_url':
                  'https://test.pagerduty.com/private/748c2b3799de1a67dd83c864d7695f76179064f7e8c641e58e5d5ac3ab5ef55f2/feed/P11ABCD',
                'personal_web_cal_url':
                  'webcal://test.pagerduty.com/private/748c2b3799de1a67dd83c864d7695f76179064f7e8c641e58e5d5ac3ab5ef55f2/feed/P11ABCD?user_id=CCCCCC2',
                'personal_http_cal_url':
                  'https://test.pagerduty.com/private/748c2b3799de1a67dd83c864d7695f76179064f7e8c641e58e5d5ac3ab5ef55f2/feed/P11ABCD?user_id=CCCCCC2',
                'privilege': {
                  'role': 'manager',
                  'permissions': [
                    'create',
                    'update',
                    'destroy',
                    'new',
                    'edit',
                    'crud',
                    'delete',
                    'manage',
                    'add',
                    'index',
                    'read',
                    'show',
                    'override',
                    'manage_override',
                    'manually_override',
                    'create_override',
                  ],
                },
                'users': [
                  {
                    'id': 'AAAAAA1',
                    'type': 'user_reference',
                    'summary': 'Person A',
                    'self': 'https://api.pagerduty.com/users/AAAAAA1',
                    'html_url': 'https://test.pagerduty.com/users/AAAAAA1',
                    'color': 'green',
                  },
                  {
                    'id': 'BBBBBB2',
                    'type': 'user_reference',
                    'summary': 'Person B',
                    'self': 'https://api.pagerduty.com/users/BBBBBB2',
                    'html_url': 'https://test.pagerduty.com/users/BBBBBB2',
                    'color': 'orange',
                  },
                  {
                    'id': 'CCCCCC2',
                    'type': 'user_reference',
                    'summary': 'Person C',
                    'self': 'https://api.pagerduty.com/users/CCCCCC2',
                    'html_url': 'https://test.pagerduty.com/users/CCCCCC2',
                    'color': 'cayenne',
                  },
                ],
                'escalation_policies': [
                  {
                    'id': 'PAPAPA1',
                    'type': 'escalation_policy_reference',
                    'summary': 'My Team - oncall',
                    'self': 'https://api.pagerduty.com/escalation_policies/PAPAPA1',
                    'html_url': 'https://test.pagerduty.com/escalation_policies/PAPAPA1',
                  },
                ],
                'final_schedule': {
                  'name': 'Final Schedule',
                  'rendered_schedule_entries': [
                    {
                      'start': '2023-01-01T00:00:00+01:00',
                      'end': '2023-01-01T09:00:00+01:00',
                      'user': {
                        'id': 'CCCCCC2',
                        'type': 'user_reference',
                        'summary': 'Person C',
                        'self': 'https://api.pagerduty.com/users/CCCCCC2',
                        'html_url': 'https://test.pagerduty.com/users/CCCCCC2',
                        'color': 'cayenne',
                      },
                      'id': 'Q0J0IUN5TEJPR5',
                    },
                    {
                      'start': '2023-01-01T09:00:00+01:00',
                      'end': '2023-01-04T09:00:00+01:00',
                      'user': {
                        'id': 'AAAAAA1',
                        'type': 'user_reference',
                        'summary': 'Person A',
                        'self': 'https://api.pagerduty.com/users/AAAAAA1',
                        'html_url': 'https://test.pagerduty.com/users/AAAAAA1',
                        'color': 'green',
                      },
                      'id': 'Q0WU3DL3Y67JU2',
                    },
                    {
                      'start': '2023-01-04T09:00:00+01:00',
                      'end': '2023-01-07T09:00:00+01:00',
                      'user': {
                        'id': 'BBBBBB2',
                        'type': 'user_reference',
                        'summary': 'Person B',
                        'self': 'https://api.pagerduty.com/users/BBBBBB2',
                        'html_url': 'https://test.pagerduty.com/users/BBBBBB2',
                        'color': 'orange',
                      },
                      'id': 'Q06KP0Z1CXWTWM',
                    },
                    {
                      'start': '2023-01-07T09:00:00+01:00',
                      'end': '2023-01-10T09:00:00+01:00',
                      'user': {
                        'id': 'CCCCCC2',
                        'type': 'user_reference',
                        'summary': 'Person C',
                        'self': 'https://api.pagerduty.com/users/CCCCCC2',
                        'html_url': 'https://test.pagerduty.com/users/CCCCCC2',
                        'color': 'cayenne',
                      },
                      'id': 'Q3DVLOO203AUSP',
                    },
                    {
                      'start': '2023-01-10T09:00:00+01:00',
                      'end': '2023-01-10T09:46:07+01:00',
                      'user': {
                        'id': 'AAAAAA1',
                        'type': 'user_reference',
                        'summary': 'Person A',
                        'self': 'https://api.pagerduty.com/users/AAAAAA1',
                        'html_url': 'https://test.pagerduty.com/users/AAAAAA1',
                        'color': 'green',
                      },
                      'id': 'Q3QM6XM04UM1V9',
                    },
                    {
                      'start': '2023-01-10T09:46:07+01:00',
                      'end': '2023-01-10T15:00:57+01:00',
                      'user': {
                        'id': 'CCCCCC2',
                        'type': 'user_reference',
                        'summary': 'Person C',
                        'self': 'https://api.pagerduty.com/users/CCCCCC2',
                        'html_url': 'https://test.pagerduty.com/users/CCCCCC2',
                        'color': 'cayenne',
                      },
                      'id': 'Q3Z5SW2UL5FI0W',
                    },
                    {
                      'start': '2023-01-10T15:00:57+01:00',
                      'end': '2023-01-13T09:00:00+01:00',
                      'user': {
                        'id': 'AAAAAA1',
                        'type': 'user_reference',
                        'summary': 'Person A',
                        'self': 'https://api.pagerduty.com/users/AAAAAA1',
                        'html_url': 'https://test.pagerduty.com/users/AAAAAA1',
                        'color': 'green',
                      },
                      'id': 'Q39YAFDT2X4S3T',
                    },
                    {
                      'start': '2023-01-13T09:00:00+01:00',
                      'end': '2023-01-14T09:00:00+01:00',
                      'user': {
                        'id': 'BBBBBB2',
                        'type': 'user_reference',
                        'summary': 'Person B',
                        'self': 'https://api.pagerduty.com/users/BBBBBB2',
                        'html_url': 'https://test.pagerduty.com/users/BBBBBB2',
                        'color': 'orange',
                      },
                      'id': 'Q2K1J2RR6LSM6Q',
                    },
                    {
                      'start': '2023-01-14T09:00:00+01:00',
                      'end': '2023-01-14T17:00:00+01:00',
                      'user': {
                        'id': 'AAAAAA1',
                        'type': 'user_reference',
                        'summary': 'Person A',
                        'self': 'https://api.pagerduty.com/users/AAAAAA1',
                        'html_url': 'https://test.pagerduty.com/users/AAAAAA1',
                        'color': 'green',
                      },
                      'id': 'Q11V6I09CLZABI',
                    },
                    {
                      'start': '2023-01-14T17:00:00+01:00',
                      'end': '2023-01-16T09:00:00+01:00',
                      'user': {
                        'id': 'BBBBBB2',
                        'type': 'user_reference',
                        'summary': 'Person B',
                        'self': 'https://api.pagerduty.com/users/BBBBBB2',
                        'html_url': 'https://test.pagerduty.com/users/BBBBBB2',
                        'color': 'orange',
                      },
                      'id': 'Q0BLS4B7HPL7EF',
                    },
                    {
                      'start': '2023-01-16T09:00:00+01:00',
                      'end': '2023-01-19T09:00:00+01:00',
                      'user': {
                        'id': 'CCCCCC2',
                        'type': 'user_reference',
                        'summary': 'Person C',
                        'self': 'https://api.pagerduty.com/users/CCCCCC2',
                        'html_url': 'https://test.pagerduty.com/users/CCCCCC2',
                        'color': 'cayenne',
                      },
                      'id': 'Q0PRARP5LE9EHC',
                    },
                    {
                      'start': '2023-01-19T09:00:00+01:00',
                      'end': '2023-01-22T09:00:00+01:00',
                      'user': {
                        'id': 'AAAAAA1',
                        'type': 'user_reference',
                        'summary': 'Person A',
                        'self': 'https://api.pagerduty.com/users/AAAAAA1',
                        'html_url': 'https://test.pagerduty.com/users/AAAAAA1',
                        'color': 'green',
                      },
                      'id': 'Q3J09C169NQFD2',
                    },
                    {
                      'start': '2023-01-22T09:00:00+01:00',
                      'end': '2023-01-25T09:00:00+01:00',
                      'user': {
                        'id': 'BBBBBB2',
                        'type': 'user_reference',
                        'summary': 'Person B',
                        'self': 'https://api.pagerduty.com/users/BBBBBB2',
                        'html_url': 'https://test.pagerduty.com/users/BBBBBB2',
                        'color': 'orange',
                      },
                      'id': 'Q3WTULC4QBCPFM',
                    },
                    {
                      'start': '2023-01-25T09:00:00+01:00',
                      'end': '2023-01-28T09:00:00+01:00',
                      'user': {
                        'id': 'CCCCCC2',
                        'type': 'user_reference',
                        'summary': 'Person C',
                        'self': 'https://api.pagerduty.com/users/CCCCCC2',
                        'html_url': 'https://test.pagerduty.com/users/CCCCCC2',
                        'color': 'cayenne',
                      },
                      'id': 'Q36JD8Q2V30JIJ',
                    },
                    {
                      'start': '2023-01-28T09:00:00+01:00',
                      'end': '2023-01-31T09:00:00+01:00',
                      'user': {
                        'id': 'AAAAAA1',
                        'type': 'user_reference',
                        'summary': 'Person A',
                        'self': 'https://api.pagerduty.com/users/AAAAAA1',
                        'html_url': 'https://test.pagerduty.com/users/AAAAAA1',
                        'color': 'green',
                      },
                      'id': 'Q2HPLV10ZUPTLG',
                    },
                    {
                      'start': '2023-01-31T09:00:00+01:00',
                      'end': '2023-02-01T00:00:00+01:00',
                      'user': {
                        'id': 'BBBBBB2',
                        'type': 'user_reference',
                        'summary': 'Person B',
                        'self': 'https://api.pagerduty.com/users/BBBBBB2',
                        'html_url': 'https://test.pagerduty.com/users/BBBBBB2',
                        'color': 'orange',
                      },
                      'id': 'Q2UG6EBLDIB11D',
                    },
                  ],
                  'rendered_coverage_percentage': 100.0,
                },
                'oncall': {
                  'start': '2023-01-31T09:00:00+01:00',
                  'end': '2023-02-03T09:00:00+01:00',
                  'user': {
                    'id': 'BBBBBB2',
                    'type': 'user_reference',
                    'summary': 'Person B',
                    'self': 'https://api.pagerduty.com/users/BBBBBB2',
                    'html_url': 'https://test.pagerduty.com/users/BBBBBB2',
                    'color': 'orange',
                  },
                  'id': 'Q2UG6EBLDIB11D',
                },
                'teams': [
                  {
                    'id': 'PBFAZV6',
                    'type': 'team_reference',
                    'summary': 'My Team - oncall',
                    'self': 'https://api.pagerduty.com/teams/PBFAZV6',
                    'html_url': 'https://test.pagerduty.com/teams/PBFAZV6',
                  },
                ],
              },
            ],
            'privilege': {
              'role': 'manager',
              'permissions': [
                'create',
                'update',
                'destroy',
                'new',
                'edit',
                'crud',
                'delete',
                'manage',
                'add',
                'index',
                'read',
                'show',
                'override',
                'manage_override',
                'manually_override',
                'create_override',
              ],
            },
            'limit': 500,
            'offset': 0,
            'total': 1,
            'more': false,
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
    )

    const results = await getStats(Config)

    expect(results.holidays).toMatchInlineSnapshot('0')
    expect(results.workingDays).toMatchInlineSnapshot('31')
    expect(results.weekDays).toMatchInlineSnapshot('15')
    expect(Array.from(results.people.keys())).toMatchInlineSnapshot(`
      [
        "Tomas",
        "Alex",
        "Luigi",
      ]
    `)
    expect(sum(Array.from(results.people.values()).flat())).toMatchInlineSnapshot('568')
  })
})
