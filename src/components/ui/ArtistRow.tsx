import type { Artist } from "~/types/spotify-types";
import { ImageWithFallback } from "./ImageWithFallback";
import { ErrorSVG } from "./icons";

interface Props {
  artist: Artist;
}

export const ArtistRow = ({ artist }: Props) => {
  return (
    <div
      className={`grid grid-cols-2 text-accent-content`}
      style={{ gridTemplateColumns: "1fr 6fr" }}
    >
      {artist.images && artist.images[2]?.url ? (
        <ImageWithFallback
          src={artist.images[2].url}
          className="m-1 h-16 w-16 rounded-xl bg-base-100 flex items-center justify-center"
          fallback={<ErrorSVG/>}
          height={128}
          width={128}
          quality={60}
        />
      ) : (
        <div className="h-20 w-20 rounded-xl bg-slate-400"></div>
      )}

      <div className="ml-4 flex items-center justify-start font-medium">
        {artist.name}
      </div>
    </div>
  );
};
