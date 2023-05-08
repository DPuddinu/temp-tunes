interface Results {
  title: string;
  artists: string[];
  tags?: string[];
  creator: string;
  playlist?: string;
}
export const SearchResultRow = ({ title, artists, tags, playlist, creator }: Results) => {
  return (
    <div className="flex gap-2 rounded-lg bg-base-200 p-2 shadow">
      <div className="flex grow flex-col gap-2 p-2">
        <div>
          <p className="text-md font-neutral-content font-semibold italic tracking-wide">Title</p>
          <p className="text-sm text-base-content font-accent-content">{title}</p>
        </div>
        <div>
          <p className="text-sm font-medium tracking-wider text-base-content">
            Artists
          </p>
          <p>{artists.map((artist) => artist).join(", ")}</p>
        </div>
      </div>
      <div className="flex grow flex-col gap-2 p-2">
        <div>
          <p className="text-sm font-medium tracking-wider text-base-content">
            Tags
          </p>
          <p>{tags && tags.map((tag) => tag).join(", ")}</p>
        </div>
        <div>
          <p className="text-sm font-medium tracking-wider text-base-content">
            Playlist
          </p>
          <p>{playlist && playlist}</p>
        </div>
      </div>
      <div className="flex grow flex-col gap-2 p-2">
        <div>
          <p className="text-sm font-medium tracking-wider text-base-content">
            Creator
          </p>
          <p>{creator}</p>
        </div>
      </div>
    </div>
  );
};