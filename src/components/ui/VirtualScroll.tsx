import {
  useWindowVirtualizer,
  type VirtualItem,
} from "@tanstack/react-virtual";
import { useLayoutEffect, useRef, type ReactNode } from "react";

interface props {
  data: unknown[];
  height?: string;
  width?: string;
  row: (currentVirtualItem: VirtualItem) => ReactNode;
}
const VirtualScroll = ({ data, row, height }: props) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const parentOffsetRef = useRef(0);

  useLayoutEffect(() => {
    parentOffsetRef.current = parentRef.current?.offsetTop ?? 0;
  }, []);

  const virtualizer = useWindowVirtualizer({
    count: data.length,
    estimateSize: () => 45,
    scrollMargin: parentOffsetRef.current,
  });

  const items = virtualizer.getVirtualItems();

  return (
    <div ref={parentRef}>
      <div
        className="relative w-full"
        style={{
          height: height ? height : virtualizer.getTotalSize(),
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            transform: `translateY(${
              items[0] && items[0]?.start - virtualizer.options.scrollMargin
            }px )`,
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
