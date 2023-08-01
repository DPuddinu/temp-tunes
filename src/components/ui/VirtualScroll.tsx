import {
  useVirtualizer,
  type VirtualItem,
} from "@tanstack/react-virtual";
import { useLayoutEffect, useRef, type ReactNode } from "react";

interface props {
  data: unknown[];
  height: string;
  row: (currentVirtualItem: VirtualItem) => ReactNode;
}
const VirtualScroll = ({ data, row, height }: props) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const parentOffsetRef = useRef(0);

  useLayoutEffect(() => {
    parentOffsetRef.current = parentRef.current?.offsetTop ?? 0;
  }, []);

  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 45,
  });

  const items = virtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      className="w-full overflow-auto"
      style={{
        height: height,
        contain: "strict",
      }}
    >
      <div
        style={{
          height: virtualizer.getTotalSize(),
          width: "100%",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            transform: `translateY(${items[0] && items[0].start}px)`,
          }}
        >
          {items.map((virtualRow) => (
            <>
              {data && data[virtualRow.index] && (
                <div
                  key={virtualRow.key}
                  ref={virtualizer.measureElement}
                  data-index={virtualRow.index}
                >
                  {row(virtualRow)}
                </div>
              )}
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VirtualScroll;
