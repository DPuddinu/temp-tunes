import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    Spotify: typeof Spotify;
  }
}
const track = {
  name: "",
  album: {
    images: [{ url: "" }],
  },
  artists: [{ name: "" }],
};
export const SpotifyWebPlayer = () => {
  const { data } = useSession();
  const [player, setPlayer] = useState<Spotify.Player>();
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const [current_track, setTrack] = useState(track);

  useEffect(() => {
    if (data?.accessToken) {
      console.log(data?.accessToken);
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;

      document.body.appendChild(script);

      (window as Window).onSpotifyWebPlaybackSDKReady = () => {
        const player = new window.Spotify.Player({
          name: "Web Playback SDK",
          getOAuthToken: (cb: any) => {
            cb(data?.accessToken);
          },
          volume: 0.5,
        });

        setPlayer(player);

        player.addListener("player_state_changed", (state) => {
          if (!state) {
            return;
          }
          console.log(state);
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
    return () => {
      player?.disconnect();
    };
  }, [data?.accessToken]);

  return (
    <>
      <div className="container">
        <div className="main-wrapper">
          {current_track?.album?.images[0]?.url && (
            <Image
              src={current_track.album?.images[0].url}
              className="now-playing__cover"
              alt=""
              width={64}
              height={64}
            />
          )}

          <div className="now-playing__side">
            <div className="now-playing__name">{current_track.name}</div>

            {current_track.artists[0] && (
              <div className="now-playing__artist">
                {current_track.artists[0].name}
              </div>
            )}
          </div>
          {player && (
            <div>
              <button
                className="btn"
                onClick={() => {
                  player?.previousTrack();
                }}
              >
                &lt;&lt;
              </button>

              <button
                className="btn"
                onClick={() => {
                  player?.togglePlay();
                }}
              >
                {is_paused ? "PLAY" : "PAUSE"}
              </button>

              <button
                className="btn"
                onClick={() => {
                  player.nextTrack();
                }}
              >
                &gt;&gt;
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
