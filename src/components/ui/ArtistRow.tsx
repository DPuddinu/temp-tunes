import Image from "next/image";
import type { Artist } from "~/types/spotify-types";

interface Props {
  artist: Artist 
}

export const ArtistRow = ({ artist }: Props) => {
  
  return (
    <div
      className={`grid grid-cols-2 text-accent-content`}
      style={{ gridTemplateColumns: "1fr 6fr" }}
    >
      {artist.images && artist.images[2]?.url ? (
        <Image alt="" src={artist.images[2].url} className="rounded-xl p-1" height={128} width={128}/>
      ) : (
        <div className="h-20 w-20 rounded-xl bg-slate-400"></div>
      )}

      <div className="ml-4 flex items-center justify-start font-medium">
        {artist.name}
      </div>
    </div>
  );
};
