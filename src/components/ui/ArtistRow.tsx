interface Props {
  label: string;
  artistImageUrl: string | undefined;
}

export const ArtistRow = ({ label, artistImageUrl }: Props) => {
  return (
    <div
      className={`grid grid-cols-2 text-accent-content`}
      style={{ gridTemplateColumns: "1fr 6fr" }}
    >
      {artistImageUrl ? (
        <img src={artistImageUrl} alt="user_image" className="rounded-xl p-1" />
      ) : (
        <div className="h-20 w-20 rounded-xl bg-slate-400"></div>
      )}

      <div className="ml-4 flex items-center justify-start font-medium">
        {label}
      </div>
    </div>
  );
};
