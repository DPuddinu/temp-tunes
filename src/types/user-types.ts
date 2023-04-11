import z from "zod";

export const TagType = ["track", "playlist"] as const;

export const TagSchema = z.object({
  id: z.string().optional(),
  spotifyId: z.string(),
  spotifyType: z.enum(TagType),
  spotifyName: z.string(),
  userId: z.string(),
  name: z.string(),
});

export type TagSchemaType = z.infer<typeof TagSchema>;

export const TagTypeEnum = z.enum(TagType);
export type TagType = z.infer<typeof TagTypeEnum>;
