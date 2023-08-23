import { useTranslation } from "next-i18next";
import Link from "next/link";
import { type ReactNode } from "react";
import FloatingActionButton from "../ui/FloatingActionButton";
import {
  CreateTemplateSVG,
  ExploreSVG,
  ImportSVG,
  PlusSVG,
  TemplateSVG,
} from "../ui/icons";

export type TemplatePage =
  | "my_templates"
  | "create_template"
  | "import_template"
  | "explore"
  | "details"
  | "create_playlist";

interface props {
  children: ReactNode;
  title?: TemplatePage;
}
const TemplateLayout = ({ children, title }: props) => {
  const { t } = useTranslation("templates");
  const { t: t_common } = useTranslation("common");

  return (
    <>
      <section className="relative mb-16 flex flex-col justify-between">
        {title && (
          <h1 className="mb-2 ml-2 w-fit pb-2 text-2xl font-semibold transition-transform sm:text-3xl">
            {t(title, { defaultValue: "not found" })}
          </h1>
        )}
        {children}
      </section>
      <div className="fixed bottom-[5rem] right-5 sm:bottom-4 ">
        <FloatingActionButton
          intent={"primary"}
          size={"md"}
          options={[
            <Link href={"/templates"} key="myTemplates">
              <FabChild
                label={t("my_templates")}
                className="border-orange-500 bg-orange-500 hover:border-orange-500 hover:bg-orange-500"
              >
                <TemplateSVG />
              </FabChild>
            </Link>,
            <Link href={"/templates/explore"} key="explore">
              <FabChild
                label={t("explore")}
                className="border-yellow-500 bg-yellow-500 hover:border-yellow-500 hover:bg-yellow-500"
              >
                <ExploreSVG />
              </FabChild>
            </Link>,
            <Link href={"/templates/import"} key="import">
              <FabChild
                label={t_common("import")}
                className="border-green-500 bg-green-500 hover:border-green-500  hover:bg-green-500"
              >
                <ImportSVG />
              </FabChild>
            </Link>,
            <Link href={"/templates/create"} key="create">
              <FabChild
                label={t_common("create")}
                className="border-blue-500 bg-blue-500 hover:border-blue-500 hover:bg-blue-500"
              >
                <CreateTemplateSVG />
              </FabChild>
            </Link>,
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
  className?: string;
  onClick?: () => void;
}
const FabChild = ({
  label,
  children,
  disabled = false,
  className,
  onClick,
}: FabChildProps) => {
  return (
    <div className="flex items-center gap-4 hover:scale-105">
      <div className="rounded-md bg-neutral p-1 px-3 uppercase">{label}</div>
      <FloatingActionButton
        size={"sm"}
        disabled={disabled}
        className={className}
        onClick={onClick}
      >
        {children}
      </FloatingActionButton>
    </div>
  );
};
export default TemplateLayout;
