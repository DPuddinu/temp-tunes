import { type PlaylistTemplate, type TemplateEntry } from "@prisma/client";
import { useTranslation } from "next-i18next";
import { useRef, useState } from "react";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/utils/api";
import { cn } from "~/utils/utils";
import Accordion from "../ui/Accordion";
import DropdownMenu from "../ui/DropdownMenu";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { ArrowSVG, ArrowUpSVG } from "../ui/icons";

export const MyTemplates = () => {
  const { setMessage } = useToast();
  const { t } = useTranslation("templates");
  const { t: t_common } = useTranslation("common");
  const { data, isLoading } = api.template.getCurrentUserTemplates.useQuery(
    undefined,
    {
      onError(err) {
        const msg = t("get_error");
        setMessage(msg);
      },
    }
  );

  return (
    <section>
      <h1 className="mb-4 text-3xl font-semibold">{t("my_templates")}</h1>
      {data &&
        data.map((template) => (
          <TemplateRow key={template.id} template={template} />
        ))}
      {isLoading && <LoadingSpinner />}
    </section>
  );
};

const TemplateRow = ({
  template,
}: {
  template: PlaylistTemplate & {
    templateEntries: TemplateEntry[];
  };
}) => {
  const { name, description, templateEntries } = template;
  const [open, setOpen] = useState(false);

  const { t } = useTranslation("common");
  return (
    <div className="rounded-box  bg-base-300 p-4 shadow">
      <div className="flex items-center justify-between">
        <div className="truncate grow" onClick={() => setOpen((open) => !open)}>
          <h2 className="truncate text-3xl">{name}</h2>
          <p className="truncate text-sm">{description}</p>
        </div>

        <DropdownMenu intent={"dark"}>
          <DropdownMenu.Options
            options={[
              {
                label: t("edit"),
                onClick: () => false,
                disabled: true,
              },
              {
                label: t("delete"),
                onClick: () => false,
                disabled: true,
              },
              {
                label: t("share"),
                onClick: () => false,
                disabled: true,
              },
            ]}
          />
        </DropdownMenu>
      </div>
      <div
        className={cn(
          "collapse mt-2 bg-base-200 px-2",
          open ? "block" : "hidden"
        )}
      >
        <input type="checkbox" checked={open} disabled className="hidden" />
        <div className="collapse-content p-2">
          <div className="">
            {templateEntries.map(({ entry, id }) => (
              <p key={id}>{entry}</p>
            ))}
          </div>
          <div
            className="mt-2 flex w-full justify-center"
            onClick={() => setOpen((open) => !open)}
          >
            <ArrowSVG className="w-12 rotate-180 justify-center " />
          </div>
        </div>
      </div>
    </div>
  );
};
