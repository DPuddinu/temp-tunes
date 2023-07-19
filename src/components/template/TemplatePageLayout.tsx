import { useTranslation } from "next-i18next";
import Link from "next/link";
import { type ReactNode } from "react";
import FloatingActionButton from "../ui/FloatingActionButton";
import { CreateTemplateSVG, ExploreSVG, ImportSVG, PlusSVG } from "../ui/icons";

const TemplateLayout = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation("templates");
  return (
    <>
      <section className="relative mb-16 flex flex-col justify-between">
        <Link href={"/templates"}>
          <h1 className="mb-2 ml-2 w-fit pb-2 text-2xl font-semibold transition-transform hover:scale-105 sm:text-3xl">
            {t("my_templates")}
          </h1>
        </Link>
        {children}
      </section>
      <div className="fixed bottom-[5rem] right-5 sm:bottom-4 ">
        <FloatingActionButton
          intent={"primary"}
          size={"md"}
          options={[
            <FabChild key="explore" label="explore" disabled>
              <ExploreSVG />
            </FabChild>,
            <FabChild key="import" label="import" disabled>
              <ImportSVG />
            </FabChild>,
            <FabChild key="create" label="create">
              <Link href={"/templates/create"}>
                <CreateTemplateSVG />
              </Link>
            </FabChild>,
          ]}
        >
          <PlusSVG />
        </FloatingActionButton>
      </div>
    </>
  );
};

interface FabChildProps {
  children: ReactNode;
  label: string;
  disabled?: boolean;
}
const FabChild = ({ label, children, disabled = false }: FabChildProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="rounded-md bg-neutral p-2 px-3 uppercase">{label}</div>
      <FloatingActionButton
        intent={"secondary"}
        size={"sm"}
        disabled={disabled}
      >
        {children}
      </FloatingActionButton>
    </div>
  );
};
export default TemplateLayout;
