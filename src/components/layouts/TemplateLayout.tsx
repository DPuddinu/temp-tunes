import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { type ReactNode } from "react";
import {
  CreateTemplateSVG,
  ExploreSVG,
  ImportSVG,
  TemplateSVG,
} from "../ui/icons";
import { RoundSkeleton } from "../ui/skeletons/RoundSkeleton";

const FabGroup = dynamic(() => import("../ui/FabGroup"), {
  loading: () => <RoundSkeleton />,
});
const FabChild = dynamic(() => import("../ui/FabChild"), {
  loading: () => <RoundSkeleton />,
});

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
      <section className=" mb-16 flex flex-col justify-between">
        {title && (
          <h1 className="mb-2 ml-2 w-fit pb-2 text-2xl font-semibold transition-transform sm:text-3xl">
            {t(title, { defaultValue: "not found" })}
          </h1>
        )}
        {children}
      </section>
      <div className="fixed bottom-[5rem] right-5 sm:bottom-4 ">
        <FabGroup
          options={[
            <Link href={"/templates/create"} key="create">
              <FabChild
                label={t_common("create")}
                className="border-blue-500 bg-blue-500 hover:border-blue-400 hover:bg-blue-400"
              >
                <CreateTemplateSVG />
              </FabChild>
            </Link>,
            <Link href={"/templates/import"} key="import">
              <FabChild
                label={t_common("import")}
                className="border-green-500 bg-green-500 hover:border-green-400  hover:bg-green-400"
              >
                <ImportSVG />
              </FabChild>
            </Link>,

            <Link href={"/templates/explore"} key="explore">
              <FabChild
                label={t("explore")}
                className="border-yellow-500 bg-yellow-500 hover:border-yellow-400 hover:bg-yellow-400"
              >
                <ExploreSVG />
              </FabChild>
            </Link>,

            <Link href={"/templates"} key="myTemplates">
              <FabChild
                label={t("my_templates")}
                className="border-orange-500 bg-orange-500 hover:border-orange-400 hover:bg-orange-400"
              >
                <TemplateSVG />
              </FabChild>
            </Link>,
          ]}
        />
      </div>
    </>
  );
};

export default TemplateLayout;
