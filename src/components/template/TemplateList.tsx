import type { Template, TemplateEntry } from "@prisma/client";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import TemplateCard from "./TemplateCard";

const TemplateList = ({
  data,
}: {
  data: (Template & {
    templateEntries: TemplateEntry[];
  })[];
}) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  return (
    <div className="flex flex-col items-center gap-4 sm:grid sm:grid-cols-2 sm:items-start lg:grid-cols-3">
      {data.map((template, i) => (
        <TemplateCard
          color={template.color}
          actions={[
            {
              label: t("create_playlist"),
              onClick: () => router.push(`/templates/create/${template.id}`),
            },
          ]}
          key={template.id}
          template={template}
          index={i}
        />
      ))}
    </div>
  );
};

export default TemplateList;
