import { useTranslation } from "next-i18next";
import Link from "next/link";
import { type ReactNode } from "react";

const TemplateLayout = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation("templates");

  return (
    <>
      <section className="relative mb-12 flex flex-col justify-between">
        <Link href={"/templates"}>
          <h1 className="mb-2 ml-2 w-fit pb-2 text-2xl font-semibold transition-transform hover:scale-105 sm:text-3xl">
            {t("my_templates")}
          </h1>
        </Link>
        {children}
      </section>
      <div className="fixed top-[calc(100%-8rem)] right-5 flex justify-end sm:top-[calc(100vh-4rem)]">
        <Link href={"/templates/create"}>
          <button className="btn-primary btn-circle btn  text-2xl transition-transform hover:scale-105 hover:cursor-pointer">
            +
          </button>
        </Link>
      </div>
    </>
  );
};

export default TemplateLayout;
