import { useTranslation } from "next-i18next";
import Link from "next/link";
import { type ReactNode } from "react";

const TemplateLayout = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation("templates");

  return (
    <section className="flex h-full flex-col justify-between">
      <div>
        <Link href={"/templates"}>
          <h1 className="mb-4 ml-2 text-2xl font-semibold transition-transform hover:scale-110 sm:text-3xl">
            {t("my_templates")}
          </h1>
        </Link>
        {children}
      </div>

      <div className="flex justify-end ">
        <Link href={"/templates/create"}>
          <button className="btn-primary btn-circle btn  text-2xl">+</button>
        </Link>
      </div>
    </section>
  );
};

export default TemplateLayout;
