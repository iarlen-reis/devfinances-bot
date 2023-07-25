import { z } from 'zod'

const envShema = z.object({
  TELEGRAM_TOKEN: z.string(),
})

export const env = envShema.parse(process.env)
