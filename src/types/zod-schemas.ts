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

const TrackSchema = z.object({
  
  
  
  type: z.string(),
  artists: z.array(
    z.object({
      href: z.string(),
      name: z.string(),
      images: z.array(
        z.object({
          height: z.number(),
          url: z.string(),
          width: z.number(),
        })
      ),
      uri: z.string(),
      id: z.string(),
      genres: z.array(z.string()),
      followers: z.object({
        href: z.string(),
        total: z.number(),
      }),
      popularity: z.number(),
    })
  ),
  duration_ms: z.number(),
  href: z.string(),
  name: z.string(),
  images: ImagesSchema,
  uri: z.string(),
  id: z.string(),
});

export const PlaylistSchema = z.object({
  collaborative: z.boolean(),
  description: z.string(),
  external_urls: z.object({
    spotify: z.string(),
  }),
  followers: z.object({
    href: z.string(),
    total: z.number(),
  }),
  href: z.string(),
  id: z.string(),
  images: ImagesSchema,
  name: z.string(),
  owner: z.object({
    external_urls: z.object({
      spotify: z.string(),
    }),
    followers: z.object({
      href: z.string(),
      total: z.number(),
    }),
    href: z.string(),
    id: z.string(),
    type: z.string(),
    uri: z.string(),
    display_name: z.string(),
  }),
  public: z.boolean(),
  snapshot_id: z.string(),
  tracks: TrackSchema,
  type: z.string(),
  uri: z.string(),
});




