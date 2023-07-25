import { useClipboard } from "@mantine/hooks";
import { type PlaylistTemplate, type TemplateEntry } from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "~/hooks/use-toast";
import { cn } from "~/utils/utils";
import { DeleteTemplateModal } from "../modals/DeleteTemplateModal";
import DropdownMenu from "../ui/DropdownMenu";
import { ArrowSVG } from "../ui/icons";

interface cardAction {
  label: string;
  onClick: () => void;
  disabled?: boolean;
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
  const { t: tmpl } = useTranslation("templates");
  const clipboard = useClipboard({ timeout: 500 });
  const { setMessage } = useToast();

  return (
    <>
      <div className="card-compact card min-h-[14rem] w-full max-w-md bg-base-300 shadow-xl">
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
                    onClick: () => {
                      clipboard.copy(template.id);
                      const msg = tmpl("clipboard");
                      setMessage(msg);
                    },
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
          <p
            onClick={() => setOpen((open) => !open)}
            className="hover:cursor-pointer"
          >
            {open ? tmpl("view_less") : tmpl("view_more")}
          </p>
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
                {template.templateEntries.map(({ entry, id }) => (
                  <p key={id}>{entry}</p>
                ))}
              </div>
              <div
                className="mt-4 flex w-full justify-center hover:animate-bounce hover:cursor-pointer"
                onClick={() => setOpen((open) => !open)}
              >
                <ArrowSVG className="w-12 rotate-180 justify-center " />
              </div>
            </div>
          </div>
          <div className="card-actions justify-end">
            {actions.map((action) => (
              <button
                disabled={action.disabled}
                key={action.label}
                className={cn(
                  "btn text-black",
                  !color && getColorByIndex(index),
                  color,
                  color && `hover:${color}`,
                  action.disabled && "disabled"
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

const Colors = {
  red: "bg-red-500 hover:bg-red-500",
  orange: "bg-orange-500 hover:bg-orange-500",
  amber: "bg-amber-500 hover:bg-amber-500",
  yellow: "bg-yellow-500 hover:bg-yellow-500",
  lime: "bg-lime-500 hover:bg-lime-500",
  green: "bg-green-500 hover:bg-green-500",
  emerald: "bg-emerald-500 hover:bg-emerald-500",
  teal: "bg-teal-500 hover:bg-teal-500",
  cyan: "bg-cyan-500 hover:bg-cyan-500",
  sky: "bg-sky-500 hover:bg-sky-500",
  blue: "bg-blue-500 hover:bg-blue-500",
  indigo: "bg-indigo-500 hover:bg-indigo-500",
  violet: "bg-violet-500 hover:bg-violet-500",
  purple: "bg-purple-500 hover:bg-purple-500",
  fuchsia: "bg-fuchsia-500 hover:bg-fuchsia-500",
  pink: "bg-pink-500 hover:bg-pink-500",
  rose: "bg-rose-500 hover:bg-rose-500",
};

function getColorByIndex(index: number): string {
  let temp = index;
  const colors = Object.values(Colors);
  while (temp > colors.length) temp -= colors.length;

  return colors[temp] ?? Colors.blue;
}
