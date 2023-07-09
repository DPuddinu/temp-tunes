import type { Artist } from "~/types/spotify-types";
import { ImageWithFallback } from "./ImageWithFallback";
import { ErrorSVG } from "./icons";

interface Props {
  artist: Artist;
}

export const ArtistRow = ({ artist }: Props) => {
  return (
    <div
      className={`grid grid-cols-2 p-1 text-accent-content`}
      style={{ gridTemplateColumns: "1fr 6fr" }}
    >
      {artist.images && artist.images[0]?.url ? (
        <ImageWithFallback
          src={artist.images[2].url}
          className="aspect-square rounded-lg object-contain"
          fallback={<ErrorSVG />}
          height={64}
          width={64}
          quality={60}
        />
      ) : (
        <div className="h-20 w-20 rounded-xl bg-slate-400"/>
      )}

      <div className="ml-4 flex items-center justify-start font-medium">
        {artist.name}
      </div>
    </div>
  );
};
