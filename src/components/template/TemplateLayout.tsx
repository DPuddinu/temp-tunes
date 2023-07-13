import { useTranslation } from "next-i18next";
import Link from "next/link";
import { type ReactNode } from "react";

const TemplateLayout = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation("templates");

  return (
    <section>
      <div className="flex gap-4 sm:gap-10">
        <Link href={"/templates"}>
          <h1 className="mb-4 text-xl font-semibold transition-transform hover:scale-110 sm:text-3xl">
            {t("my_templates")}
          </h1>
        </Link>
        <Link href={"/templates/create"}>
          <h1 className="mb-4 text-xl font-semibold transition-transform hover:scale-110 sm:text-3xl">
            {t("create")}
          </h1>
        </Link>
      </div>
      {children}
    </section>
  );
};

export default TemplateLayout;
