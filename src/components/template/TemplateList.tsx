import { useAutoAnimate } from "@formkit/auto-animate/react";
import { type PlaylistTemplate, type TemplateEntry } from "@prisma/client";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";
import { cn } from "~/utils/utils";
import DropdownMenu from "../ui/DropdownMenu";
import { ArrowSVG } from "../ui/icons";
import { useToast } from "~/hooks/use-toast";

const TemplateList = ({ data }: {
  data: (PlaylistTemplate & {
    templateEntries: TemplateEntry[];
  })[];
}) => {
  const { setMessage } = useToast();
  const { t } = useTranslation("templates");

  const { mutate: deleteTemplate } = api.template.deleteTemplate.useMutation({
    onError() {
      const msg = t("delete_error");
      setMessage(msg);
    },
    onSuccess() {
      setTimeout(() => {
        window.dispatchEvent(new Event("focus"));
      }, 300);
      const msg = t("delete_success");
      setMessage(msg);
    },
  });
  const [parent] = useAutoAnimate();

  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3" ref={parent}>
      {data.map((template, i) => (
        <TemplateRow
          key={template.id}
          template={template}
          index={i}
          onDelete={() =>
            deleteTemplate({
              id: template.id,
              entries: template.templateEntries.map((t) => t.id),
            })
          }
        />
      ))}
    </div>
  );
};

type templateRowProps = {
  template: PlaylistTemplate & {
    templateEntries: TemplateEntry[];
  };
  index: number;
  onDelete: () => void;
};
const TemplateRow = ({ template, index, onDelete }: templateRowProps) => {
  const { name, description, templateEntries, id } = template;
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { t } = useTranslation("common");

  return (
    <div className="rounded-box h-fit bg-base-200 p-2 px-4 shadow hover:cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="grow truncate" onClick={() => setOpen((open) => !open)}>
          <h2 className="truncate text-xl sm:text-3xl">{name}</h2>
          <p className="truncate text-sm">{description}</p>
        </div>

        <DropdownMenu intent={"darkest"} direction={index > 3 ? "up" : "down"}>
          <DropdownMenu.Options
            options={[
              {
                label: t("edit"),
                onClick: () => router.push(`/templates/${id}`),
              },
              {
                label: t("delete"),
                onClick: () => onDelete(),
              },
              {
                label: t("share"),
                onClick: () => false,
                disabled: true,
              },
              {
                label: t("create_playlist"),
                onClick: () => false,
                disabled: true,
              },
            ]}
          />
        </DropdownMenu>
      </div>
      <div
        key={name}
        className={cn(
          "rounded-box collapse bg-base-200 px-2",
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
            className="mt-2 flex w-full justify-center hover:animate-bounce"
            onClick={() => setOpen((open) => !open)}
          >
            <ArrowSVG className="w-12 rotate-180 justify-center " />
          </div>
        </div>
      </div>
    </div>
  );
};
export default TemplateList;
