import { cn } from "~/utils/utils";

interface AccordionProps {
  children: React.ReactNode;
  className?: string;
}
const Accordion = ({ children, className }: AccordionProps) => {
  return (
    <div
      tabIndex={0}
      className={cn("collapse-arrow collapse bg-base-300", className)}
    >
      <input type="checkbox" />
      {children}
    </div>
  );
};

Accordion.Header = function AccordionHeader({
  children,
  className,
}: AccordionProps) {
  return (
    <div className={cn("collapse-title max-h-[3.75rem] text-xl", className)}>
      {children}
    </div>
  );
};
Accordion.Content = function AccordionContent({
  children,
  className,
}: AccordionProps) {
  return (
    <div className={cn("collapse-content !px-0 !pb-0", className)}>
      {children}
    </div>
  );
};

export default Accordion;
