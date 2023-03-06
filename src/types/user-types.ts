import z from 'zod'

export const ITag = z.object( {
  spotifyId: z.string(),
  spotifyType: z.string(),
  userId: z.string()
})
export type ITagType = z.infer<typeof ITag>;