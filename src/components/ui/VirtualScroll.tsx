import { useVirtualizer, type VirtualItem } from "@tanstack/react-virtual";
import { useRef, type ReactNode } from "react";

interface props {
  data: unknown[];
  className?: string;
  row: (currentVirtualItem: VirtualItem) => ReactNode;
}
const VirtualScroll = ({ data, className, row }: props) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 45,
  });
  const items = rowVirtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      style={{
        height: 400,
        width: 200,
        contain: "strict",
        overflowY: "auto",
      }}
      className={className}
    >
      <div
        className="relative w-full"
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            transform: `translateY(${items[0]?.start}px)`,
          }}
        >
          {items.map((virtualItem) => (
            <>
              {data && data[virtualItem.index] && (
                <div
                  key={virtualItem.key}
                  ref={rowVirtualizer.measureElement}
                  data-index={virtualItem.index}
                >
                  {row(virtualItem)}
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
