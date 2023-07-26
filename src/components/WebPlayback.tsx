import { useSpotifyPlayer } from "~/hooks/use-spotify-player";
import { api } from "~/utils/api";
import { ImageWithFallback } from "./ui/ImageWithFallback";
import { MusicalNoteSVG, PauseSVG, PlaySVG } from "./ui/icons";

export const SpotifyWebPlayer = () => {
  // prettier-ignore
  const { mutate: togglePlay } = api.player.togglePlayPause.useMutation();
  const { mutate: nextTrack } = api.player.nextTrack.useMutation();
  const { mutate: previousTrack } = api.player.previousTrack.useMutation();
  const {current_track, is_active, is_paused, player, state} = useSpotifyPlayer();
  
  return (
    <>
      {current_track && (
        <li>
          <div className="flex w-auto flex-col rounded-xl bg-base-200">
            {current_track && current_track.album?.images[0] ? (
              <>
                <div className="flex w-full max-w-[160px] justify-center gap-2">
                  <ImageWithFallback
                    src={current_track.album?.images[0].url}
                    className="rounded-md object-contain"
                    width={64}
                    height={64}
                    quality={60}
                  />
                  <div className="flex max-w-[50%] flex-col justify-center gap-1 truncate text-sm">
                    <p className="truncate">{current_track.name}</p>
                    {current_track.artists[0] && (
                      <p className="now-playing__artist truncate">
                        {current_track.artists[0].name}
                      </p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="w-full">
                  <div className="flex h-16 w-full items-center justify-center rounded-xl bg-base-100">
                    <MusicalNoteSVG />
                  </div>
                  <div className="flex flex-col justify-center gap-1 text-sm">
                    <p></p>
                    <p></p>
                  </div>
                </div>
              </>
            )}

            {player && (
              <div className="flex w-full justify-between">
                <button
                  className="btn-sm btn bg-base-300 px-4"
                  onClick={() => previousTrack()}
                >
                  &lt;&lt;
                </button>

                <button
                  className="btn-sm btn  bg-base-300"
                  onClick={() =>
                    togglePlay({
                      paused: is_paused,
                      playbackState: state !== null,
                    })
                  }
                >
                  {is_paused ? <PlaySVG /> : <PauseSVG />}
                </button>

                <button
                  className="btn-sm btn bg-base-300 px-4"
                  onClick={() => nextTrack()}
                >
                  &gt;&gt;
                </button>
              </div>
            )}
          </div>
        </li>
      )}
    </>
  );
};
