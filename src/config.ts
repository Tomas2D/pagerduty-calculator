import { z } from 'zod'

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
      domain: z.preprocess((domain) => {
        if (typeof domain === 'string' && !domain.match(/^http[s]:\/\//i)) {
          return `https://${domain}`
        }
        return domain
      }, z.string().url()),
      timeZone: z.string(),
      teamIds: z.array(z.string()),
    })
    .passthrough(),
})
