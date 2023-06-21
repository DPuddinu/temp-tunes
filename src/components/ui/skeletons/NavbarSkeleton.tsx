import { RoundSkeleton } from "./RoundSkeleton";

export const NavbarSkeleton = () => {
  return (
    <div className="navbar bg-base-300 shadow">
      <div className="flex w-full justify-end pr-2 sm:justify-between">
        <RoundSkeleton />
      </div>
    </div>
  );
};
export default NavbarSkeleton;
