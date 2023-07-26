import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

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


export const useSpotifyPlayer = () => {
  const { data } = useSession();
  const [player, setPlayer] = useState<Spotify.Player | undefined>(undefined);
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const [current_track, setTrack] = useState<TrackPlaybackType | undefined>(
    undefined
  );
  const [state, setState] = useState<Spotify.PlaybackState | null>(null);

  useEffect(() => {
    if (data?.accessToken && !player) {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;

      document.body.appendChild(script);

      (window as Window).onSpotifyWebPlaybackSDKReady = () => {
        const player = new window.Spotify.Player({
          name: "Web Playback SDK",
          getOAuthToken: (cb: any) => {
            cb(data.accessToken);
          },
          volume: 0.5,
        });
        player.addListener("player_state_changed", (state) => {
          console.log(state);
          if (!state) {
            return;
          }
          setTrack(state.track_window.current_track);
          setPaused(state.paused);

          player.getCurrentState().then((state) => {
            console.log(state);
            setState(state);
            setActive(state !== null);
          });
        });

        player.addListener(
          "not_ready",
          ({ device_id }: { device_id: string }) => {
            console.log("Device ID has gone offline", device_id);
          }
        );

        setPlayer(player);
        player.connect();
      };
    }
    return () => {
      player?.disconnect();
    };
  }, [data?.accessToken, player]);

  return {
    current_track,
    is_active,
    is_paused,
    player,
    state,
  }
}