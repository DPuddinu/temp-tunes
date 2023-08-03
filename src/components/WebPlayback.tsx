import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ImageWithFallback } from "./ui/ImageWithFallback";
import { MusicalNoteSVG, PauseSVG, PlaySVG } from "./ui/icons";

export interface TrackPlaybackType {
  name: string;
  album: {
    images: {
      url: string;
    }[];
  };
  artists: {
    name: string;
  }[];
}

export const SpotifyWebPlayer = () => {
  // prettier-ignore

  const { data: session } = useSession();
  const [spotifyPlayer, setSpotifyPlayer] = useState<
    Spotify.Player | undefined
  >(undefined);
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const [current_track, setTrack] = useState<TrackPlaybackType | undefined>(
    undefined
  );
  const [init, setInit] = useState(false);

  useEffect(() => {
    if (session?.accessToken && !init) {
      setInit((init) => {
        if (!init) {
          const script = document.createElement("script");
          script.src = "https://sdk.scdn.co/spotify-player.js";
          script.async = true;

          document.body.appendChild(script);

          (window as Window).onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
              name: "Web Playback SDK",
              getOAuthToken: (cb: any) => {
                cb(session?.accessToken);
              },
              volume: 0.5,
            });

            setSpotifyPlayer(player);

            player.addListener("player_state_changed", (state) => {
              if (!state) {
                return;
              }
              setTrack(state.track_window.current_track);
              setPaused(state.paused);

              player.getCurrentState().then((state) => {
                !state ? setActive(false) : setActive(true);
              });
            });

            player.addListener(
              "not_ready",
              ({ device_id }: { device_id: string }) => {
                console.log("Device ID has gone offline", device_id);
              }
            );

            player.connect();
          };
        }

        return true;
      });
    }
    return () => {
      spotifyPlayer?.disconnect();
    };
  }, [session, init, spotifyPlayer]);

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

            {spotifyPlayer && (
              <div className="flex w-full justify-between">
                <button
                  className="btn-sm btn bg-base-300 px-4"
                  onClick={() => spotifyPlayer.previousTrack()}
                >
                  &lt;&lt;
                </button>

                <button
                  className="btn-sm btn  bg-base-300"
                  onClick={() => {
                    if (is_paused) spotifyPlayer.togglePlay();
                    else spotifyPlayer.pause();
                  }}
                >
                  {is_paused ? <PlaySVG /> : <PauseSVG />}
                </button>

                <button
                  className="btn-sm btn bg-base-300 px-4"
                  onClick={() => spotifyPlayer.nextTrack()}
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
