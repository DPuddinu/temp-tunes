import { Transition } from "@headlessui/react";
import styled from "styled-components";

interface RowValueProps {
  value: string;
  width: number;
  color: string;
}
const Row = styled.div<RowValueProps>`
  &:after {
    content: "${(p) => p.value}";
  }
  width: ${(p) => p.width}%;
  background: ${(p) => p.color};
`;

export const ExpandRow = ({ color, value, width }: RowValueProps) => (
  <Transition
    className="flex flex-row-reverse"
    appear={true}
    show={true}
    enter="transition-width duration-[1200ms]"
    enterFrom="w-0"
    enterTo="w-full"
    leave="transition-width duration-[1200ms]"
    leaveFrom="w-full"
    leaveTo="w-0"
  >
    <Row
      className="flex items-center justify-center rounded-full px-5 py-0 text-center text-sm font-semibold text-accent-content after:flex after:items-center after:justify-center"
      color={color}
      value={value}
      width={width}
    />
  </Transition>
);
