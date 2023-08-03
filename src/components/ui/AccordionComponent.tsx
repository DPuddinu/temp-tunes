import * as Accordion from "@radix-ui/react-accordion";
import { type ReactNode } from "react";
import { ArrowSVG } from "./icons";

interface AccordionProps {
  children: ReactNode;
  title: ReactNode;
}
const AccordionComponent = ({ children, title }: AccordionProps) => {
  return (
    <Accordion.Root
      type="single"
      key="filters"
      className="m-auto mb-6 rounded-lg bg-base-200 p-2 shadow sm:text-xl lg:w-3/4"
      collapsible
    >
      <Accordion.Item value="item-1" className="">
        <Accordion.Header className="flex text-xl">
          <Accordion.Trigger className="group flex flex-1 cursor-default items-center justify-between px-2">
            {title}
            <ArrowSVG
              className="transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180"
              aria-hidden
            />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="overflow-hidden data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
          {children}
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
};
export default AccordionComponent;
