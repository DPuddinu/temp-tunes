import { useEffect, useRef } from "react";
import { PauseSVG, PlaySVG } from "../ui/icons";

interface audioRowProps {
  src: string;
  index: number;
  playing: boolean;
  setPlaying(index: number): void;
}
const AudioRow = ({ src, index, setPlaying, playing }: audioRowProps) => {
  const ref = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!playing && ref.current) {
      ref.current.pause();
    }
  }, [playing, ref]);

  return (
    <>
      <audio ref={ref} src={src} onEnded={() => setPlaying(-1)} />
      <button
        className="btn-success btn-sm btn-circle btn font-bold"
        onClick={() => {
          if (ref.current) {
            if (playing) {
              setPlaying(-1);
              ref.current.pause();
            } else {
              setPlaying(index);
              ref.current.play();
            }
          }
        }}
      >
        {playing ? (
          <PauseSVG className="scale-75" />
        ) : (
          <PlaySVG className="scale-75" />
        )}
      </button>
    </>
  );
};
export default AudioRow