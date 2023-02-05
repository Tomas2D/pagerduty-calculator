import { z } from 'zod'
import * as process from 'process'

export const configSchema = z.object({
  nicknames: z.record(z.string()).default({}),
  work: z
    .object({
      start: z.number().min(0).max(24),
      end: z.number().min(0).max(24),
    })
    .refine((obj) => obj.end > obj.start),
  dates: z
    .object({
      start: z.date(),
      end: z.date(),
      holidays: z.array(z.date()).default([]),
    })
    .refine((obj) => obj.end > obj.start),
  api: z
    .object({
      domain: z.string().url(),
      timeZone: z.string().default(process.env.TZ || 'UTC'),
      teamIds: z.array(z.string()),
    })
    .passthrough(),
})
