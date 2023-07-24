import { type PlaylistTemplate, type TemplateEntry } from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "~/utils/utils";
import { DeleteTemplateModal } from "../modals/DeleteTemplateModal";
import DropdownMenu from "../ui/DropdownMenu";
import { ArrowSVG } from "../ui/icons";

interface cardAction {
  label: string;
  onClick: () => void;
  disabled: boolean;
}

interface TemplateCardProps {
  color?: string | null;
  actions: cardAction[];
  isNew?: boolean;
  template: PlaylistTemplate & {
    templateEntries: TemplateEntry[];
  };
  index: number;
}

const TemplateCard = ({
  actions,
  color = "bg-blue-500",
  isNew = false,
  index,
  template,
}: TemplateCardProps) => {
  const [open, setOpen] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const router = useRouter();
  const { t } = useTranslation("common");
  const { t: t_tmp } = useTranslation("templates");

  return (
    <>
      <div className="card-compact card max-w-md bg-base-300 shadow-xl">
        <div
          className={cn(
            "flex h-10 !justify-end rounded-t-2xl pr-2",
            color,
            !color && getColorByIndex(index)
          )}
        >
          {template.type === "CUSTOM" && (
            <DropdownMenu
              intent={"dark"}
              direction={index > 3 ? "up" : "down"}
              color="black"
            >
              <DropdownMenu.Options
                options={[
                  {
                    label: t("edit"),
                    onClick: () => router.push(`/templates/${template.id}`),
                  },
                  {
                    label: t("delete"),
                    onClick: () => setOpenDeleteModal(true),
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
          )}
        </div>
        <div className="card-body">
          <h2 className="card-title">
            {template.name}
            {isNew && <div className="badge badge-secondary">NEW</div>}
          </h2>

          <p>{template.description}</p>
          <p onClick={() => setOpen(true)}>{t_tmp("view")}</p>
          <div
            key={template.name}
            className={cn(
              "collapse mt-2 rounded-md bg-base-100",
              open ? "block" : "hidden"
            )}
          >
            <input type="checkbox" checked={open} disabled className="hidden" />
            <div className="collapse-content p-1 px-2">
              <div className="p-2">
                {template.templateEntries.map(({ entry, id }, i) => (
                  <p key={id}>{entry}</p>
                ))}
              </div>
              <div
                className="mt-4 flex w-full justify-center hover:animate-bounce"
                onClick={() => setOpen((open) => !open)}
              >
                <ArrowSVG className="w-12 rotate-180 justify-center " />
              </div>
            </div>
          </div>
          <div className="card-actions justify-end">
            {actions.map((action) => (
              <button
                key={action.label}
                className={cn(
                  "btn text-black",
                  !color && getColorByIndex(index),
                  color,
                  color && `hover:${color}`
                )}
                onClick={action.onClick}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <DeleteTemplateModal
        onClose={() => setOpenDeleteModal(false)}
        onSuccess={() => {
          setTimeout(() => {
            window.dispatchEvent(new Event("focus"));
          }, 300);
        }}
        setIsOpen={setOpenDeleteModal}
        template={template}
        isOpen={openDeleteModal}
      />
    </>
  );
};

export default TemplateCard;

const colors = [
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
];
type intensity = "200" | "300" | "400" | "500" | "600";

function getColorByIndex(index: number, intensity: intensity = "500"): string {
  let temp = index;
  while (temp > colors.length) temp -= colors.length;

  const color = colors[temp];
  return cn(`bg-${color}-${intensity} hover:bg-${color}-${intensity}`);
}
