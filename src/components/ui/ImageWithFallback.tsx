import Image from "next/image";
import { type ReactNode } from "react";
import ImageErrorBoundary from "../ErrorBoundary";

interface props {
  height: number;
  width: number;
  quality: number;
  src: string;
  fallback?: ReactNode;
  className?: string;
}
export const ImageWithFallback = ({
  height,
  width,
  quality,
  src,
  fallback,
  className,
}: props) => {
  return (
    <ImageErrorBoundary fallback={fallback} className={className}>
      <Image
        className={className}
        src={src}
        height={height}
        width={width}
        quality={quality}
        alt='' 
      />
    </ImageErrorBoundary>
  );
};
