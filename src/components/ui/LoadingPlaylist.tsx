interface LoadingStateProps {
  progress: number | undefined;
  current: string | undefined;
}

const LoadingScreen = ({ progress, current }: LoadingStateProps) => {
  return (
    <section className="flex flex-col items-center justify-center gap-3">
      <p className="text-sm">Loading your playlists</p>
      <p className="text-sm">{current}</p>
      {!progress ? (
        <progress className="progress progress-primary w-56" />
      ) : (
        <progress
          className="progress progress-primary w-56"
          value={progress}
          max="100"
        />
      )}
    </section>
  );
};

export default LoadingScreen;