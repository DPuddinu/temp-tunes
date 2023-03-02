import { useEffect, useState } from "react";

type MoodRowProps = {
  color: string;
  label: string;
  value: number;
};
const MoodRow = ({ color, value, label }: MoodRowProps) => {
  const [tempValue, setTempValue] = useState(0);

  useEffect(() => {
    animateValue(tempValue, value, setTempValue);
  }, []);

  function animateValue(
    from: number,
    to: number,
    reducerFn: (num: number) => void
  ) {
    if (from === to) return;

    setTimeout(() => {
      reducerFn(from);
      animateValue(from + 1, to, reducerFn);
    }, 24);
  }

  return (
    <div className="mb-2 flex gap-2 p-2 ">
      <div className="w-1/2 grow text-accent-content">{label}</div>
      <div
        className="w-1/2 min-w-[30px] rounded-full text-center font-bold text-accent-content"
        style={{ width: `${tempValue}%`, background: `${color}` }}
      >
        {tempValue}%
      </div>
    </div>
  );
};

export default MoodRow;
