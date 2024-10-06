import { z } from 'zod'

export default z.object({
  name: z.string().min(1).max(100),
  list: z.string(),
})
