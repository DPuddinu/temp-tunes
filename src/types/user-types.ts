import z from 'zod'

export const TagType = ["track", "playlist"] as const;


export const TagSchema = z.object({
  spotifyId: z.string(),
  spotifyType: z.enum(TagType),
  userId: z.string(),
  name: z.string(),
});


export const TagTypeEnum = z.enum(TagType);
export type TagType = z.infer<typeof TagTypeEnum>;