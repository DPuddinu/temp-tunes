import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { PauseSVG, PlaySVG } from "./ui/icons";

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
        console.log(player);

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
    <div className="flex flex-col rounded-xl bg-base-200">
      <div className="flex justify-center gap-2">
        {current_track?.album?.images[0]?.url && (
          <Image
            src={current_track.album?.images[0].url}
            className="rounded-md"
            alt=""
            width={64}
            height={64}
          />
        )}
        <div className="flex flex-col justify-center gap-1 text-sm">
          <p>{current_track.name}</p>
          {current_track.artists[0] && (
            <p className="now-playing__artist">
              {current_track.artists[0].name}
            </p>
          )}
        </div>
      </div>

      {player && (
        <div className="flex w-full justify-around">
          <button
            className="btn-sm btn"
            onClick={() => {
              player?.previousTrack();
            }}
          >
            &lt;&lt;
          </button>

          <button className="btn-sm btn" onClick={() => player?.togglePlay()}>
            {is_paused ? <PlaySVG /> : <PauseSVG />}
          </button>

          <button
            className="btn-sm btn"
            onClick={() => {
              player.nextTrack();
            }}
          >
            &gt;&gt;
          </button>
        </div>
      )}
    </div>
  );
};
