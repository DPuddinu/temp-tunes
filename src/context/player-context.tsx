import { useSession } from "next-auth/react";
import { createContext, useState, type ReactNode, useEffect } from "react";

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

interface Data {
  state: Spotify.PlaybackState | null;
  current_track: TrackPlaybackType | undefined;
  is_active: boolean;
  is_paused: boolean;
  player: Spotify.Player | undefined;
}
const initialContext = {
  state: null,
  current_track: undefined,
  is_active: false,
  is_paused: true,
  player: undefined,
};

export const PlayerDataContext = createContext<Data>(initialContext);

const PlayerDataProvider = ({ children }: { children: ReactNode }) => {
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

        setPlayer(player);

        player.addListener("player_state_changed", (state) => {
          if (!state) {
            return;
          }
          setTrack(state.track_window.current_track);
          setPaused(state.paused);

          player.getCurrentState().then((state) => {
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

        player.connect();
      };
    }
    return () => {
      player?.disconnect();
    };
  }, [data?.accessToken]);

  

  return (
    <PlayerDataContext.Provider
      value={{
        current_track,
        is_active,
        is_paused,
        player,
        state,
      }}
    >
      {children}
    </PlayerDataContext.Provider>
  );
};

export default PlayerDataProvider;
