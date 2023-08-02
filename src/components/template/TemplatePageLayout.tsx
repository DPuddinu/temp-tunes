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
  | "create"
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
  return (
    <>
      <section className="relative mb-16 flex flex-col justify-between">
        {title && (
          <h1 className="mb-2 ml-2 w-fit pb-2 text-2xl font-semibold transition-transform sm:text-3xl">
            {t(title) ?? "not found"}
          </h1>
        )}
        {children}
      </section>
      <div className="fixed bottom-[5rem] right-5 sm:bottom-4 ">
        <FloatingActionButton
          intent={"primary"}
          size={"md"}
          options={[
            <FabChild
              key="myTemplates"
              label={t("my_templates")}
              className="border-orange-500 bg-orange-500 hover:border-orange-500 hover:bg-orange-500"
            >
              <Link href={"/templates"}>
                <TemplateSVG />
              </Link>
            </FabChild>,
            <FabChild
              key="explore"
              label={t("explore")}
              className="border-yellow-500 bg-yellow-500 hover:border-yellow-500 hover:bg-yellow-500"
            >
              <Link href={"/templates/explore"}>
                <ExploreSVG />
              </Link>
            </FabChild>,
            <FabChild
              key="import"
              label={t("import")}
              disabled
              className="border-green-500 bg-green-500 hover:border-green-500  hover:bg-green-500"
            >
              <Link href={"/templates/import"}>
                <ImportSVG />
              </Link>
            </FabChild>,
            <FabChild
              key="create"
              label={t("create")}
              className="border-blue-500 bg-blue-500 hover:border-blue-500 hover:bg-blue-500"
            >
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
