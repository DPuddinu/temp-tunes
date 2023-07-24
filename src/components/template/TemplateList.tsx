import { useAutoAnimate } from "@formkit/auto-animate/react";
import { type PlaylistTemplate, type TemplateEntry } from "@prisma/client";
import { useTranslation } from "react-i18next";
import TemplateCard from "./TemplateCard";

const TemplateList = ({
  data,
}: {
  data: (PlaylistTemplate & {
    templateEntries: TemplateEntry[];
  })[];
}) => {
  const [parent] = useAutoAnimate();
  const { t } = useTranslation("templates");

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" ref={parent}>
      {data.map((template, i) => (
        <TemplateCard
          color={template.color}
          isNew={false}
          actions={[
            {
              disabled: false,
              label: t("create"),
              onClick: () => false,
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
