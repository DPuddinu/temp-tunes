import { LazyMotion, domAnimation, m } from "framer-motion";

interface RowValueProps {
  value: string;
  width: number;
  color: string;
}

export const ExpandRow = ({ color, value, width }: RowValueProps) => (
  <LazyMotion features={domAnimation}>
    <m.div
      transition={{
        duration: 1.2,
      }}
      initial={{ width: 0 }}
      animate={{ width: `${width}%` }}
      className="flex items-center justify-center rounded-full px-5 py-0 text-center text-sm font-semibold text-accent-content"
      style={{ background: color }}
    >
      {value}
    </m.div>
  </LazyMotion>
);
