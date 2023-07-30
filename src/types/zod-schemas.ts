import z from "zod";

export const TagType = ["track", "playlist"] as const;
export const TagTypeEnum = z.enum(TagType);
export type TagType = z.infer<typeof TagTypeEnum>;

export const SearchTypeConst = ["track", "playlist", "tag"] as const;
export const SearchTypeEnum = z.enum(SearchTypeConst);
export type SearchType = z.infer<typeof SearchTypeEnum>;

export const TagSchema = z.object({
  id: z.string().optional(),
  spotifyId: z.string(),
  userId: z.string().optional(),
  name: z.string().min(3).max(16),
});

export type TagSchemaType = z.infer<typeof TagSchema>;



const ImagesSchema = z.array(
  z.object({
    height: z.number().nullish(),
    url: z.string(),
    width: z.number().nullish(),
  })
);
export const ArtistSchema = z.object({
  genres: z.array(z.string()).optional(),
  name: z.string(),
  images: ImagesSchema.optional(),
  uri: z.string().nullish(),
  id: z.string().nullish(),
});
export const TrackSchema = z.object({
  type: z.string(),
  artists: ArtistSchema.array(),
  duration_ms: z.number(),
  name: z.string(),
  images: ImagesSchema.optional(),
  id: z.string().nullish(),
  uri: z.string(),
});

export const PlaylistSchema = z.object({
  id: z.string(),
  images: ImagesSchema,
  name: z.string(),
  owner: z.object({
    display_name: z.string(),
    id: z.string()
  }),
  tracks: TrackSchema.array(),
  type: z.string(),
  uri: z.string(),
});

export const TemplateEntrySchema = z.object({
  id: z.string().optional(),
  templateId: z.string().optional(),
  entry: z.string().min(3),
})

export const TemplateSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  stars: z.number(),
  templateEntries: TemplateEntrySchema.array()
})

export type TemplateSchemaEntryType = z.infer<typeof TemplateEntrySchema>
export type TemplateSchemaType = z.infer<typeof TemplateSchema>


export const DeviceSchema = z.object({
  id: z.string(),
  is_active: z.boolean(),
  is_private_session: z.boolean(),
  is_restricted: z.boolean(),
  name: z.string(),
  type: z.string(),
  volume_percent: z.number()
})
export type DeviceType = z.infer<typeof DeviceSchema>