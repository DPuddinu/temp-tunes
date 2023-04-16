import z from "zod";

export const TagType = ["track", "playlist"] as const;

export const TagSchema = z.object({
  id: z.string().optional(),
  spotifyId: z.string(),
  spotifyType: z.enum(TagType),
  userId: z.string(),
  name: z.string(),
});

export type TagSchemaType = z.infer<typeof TagSchema>;

export const TagTypeEnum = z.enum(TagType);
export type TagType = z.infer<typeof TagTypeEnum>;

const ImagesSchema = z.array(
  z.object({
    height: z.number(),
    url: z.string(),
    width: z.number(),
  })
);
export const ArtistSchema = z.object({
  genres: z.array(z.string()).optional(),
  name: z.string(),
  images: ImagesSchema.optional(),
  uri: z.string(),
  id: z.string(),
});
export const TrackSchema = z.object({
  type: z.string(),
  artists: ArtistSchema.array(),
  duration_ms: z.number(),
  name: z.string(),
  images: ImagesSchema.optional(),
  id: z.string(),
  uri: z.string()
})

export const PlaylistSchema = z.object({
  id: z.string(),
  images: ImagesSchema,
  name: z.string(),
  owner: z.object({
    display_name: z.string(),
  }),
  tracks: TrackSchema.array(),
  type: z.string(),
  uri: z.string(),
});



