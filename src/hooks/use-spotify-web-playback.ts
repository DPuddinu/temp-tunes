import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
declare global {
  interface Window {
    Spotify: typeof Spotify;
  }
}

interface TrackType {
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


export const useSpotifyPlayback = () => {
  const { data } = useSession();
  const [player, setPlayer] = useState<Spotify.Player | undefined>(undefined);
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const [current_track, setTrack] = useState<TrackType | undefined>(undefined);

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

  return {
    player,
    is_active,
    is_paused,
    current_track
  }
}