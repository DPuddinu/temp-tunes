import { RoundSkeleton } from "./RoundSkeleton";

export const NavbarSkeleton = () => {
  return (
    <div className="flex h-16 items-center justify-end bg-base-300 pr-2 shadow">
      <RoundSkeleton />
    </div>
  );
};
export default NavbarSkeleton;
