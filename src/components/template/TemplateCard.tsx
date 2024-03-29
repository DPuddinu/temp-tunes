import { useClipboard } from "@mantine/hooks";
import { type Template, type TemplateEntry } from "@prisma/client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "next-i18next";
import { useToast } from "~/hooks/use-toast";
import { cn } from "~/utils/utils";
import { MenuItem } from "../playlist/PlaylistComponent";
import {
  ArrowSVG,
  DeleteSVG,
  PencilSVG,
  ShareSVG,
  VerticalDotsSVG,
} from "../ui/icons";
import { DeleteTemplateModal } from "../ui/modals/DeleteTemplateModal";
interface cardAction {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

interface TemplateCardProps {
  color?: string | null;
  actions: cardAction[];
  template: Template & {
    templateEntries: TemplateEntry[];
  };
  showOptions?: boolean;
  index: number;
}

const TemplateCard = ({
  actions,
  color = TemplateColors.blue,
  index,
  template,
  showOptions = true,
}: TemplateCardProps) => {
  const [open, setOpen] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { t } = useTranslation("common");
  const { t: tmpl } = useTranslation("templates");
  const clipboard = useClipboard({ timeout: 500 });
  const { setMessage } = useToast();
  const { data: sessionData } = useSession();

  return (
    <>
      <div className="card-compact card h-fit min-h-[14rem] w-full max-w-md bg-base-300 shadow-xl">
        <div
          className={cn(
            "flex h-10 !justify-end rounded-t-2xl pr-2",
            color,
            !color && getColorByIndex(index)
          )}
        >
          {showOptions && (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button aria-label="Customise options">
                  <VerticalDotsSVG className="stroke-neutral-900" />
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className=" rounded-md border border-base-300 bg-base-100 p-2 will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade sm:w-auto"
                  sideOffset={5}
                  side="bottom"
                  align="end"
                >
                  {template.userId === sessionData?.user?.id && (
                    <MenuItem>
                      <Link
                        href={`/templates/${template.id}`}
                        className="flex items-center gap-2 "
                      >
                        <PencilSVG />
                        {t("edit")}
                      </Link>
                    </MenuItem>
                  )}
                  <MenuItem onClick={() => setOpenDeleteModal(true)}>
                    <DeleteSVG />
                    {t("delete")}
                  </MenuItem>
                  <MenuItem>
                    <Link
                      href={`/templates/${template.id}`}
                      className="flex items-center gap-2 "
                      onClick={() => {
                        clipboard.copy(
                          `${window.location.origin}/templates/import/${template.id}`
                        );
                        const msg = tmpl("clipboard");
                        setMessage(msg);
                      }}
                    >
                      <ShareSVG />
                      {t("share")}
                    </Link>
                  </MenuItem>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          )}
        </div>
        <div className="card-body">
          <h2 className="card-title flex flex-col items-start">
            <p className="font-bold"> {template.name}</p>
            <p className="text-xs">By {template.userName}</p>
          </h2>

          <p className="mt-2 font-semibold">{template.description}</p>
          <p
            onClick={() => setOpen((open) => !open)}
            className="hover:cursor-pointer font-bold"
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
                  "btn text-black border-none",
                  color,
                  !color && getColorByIndex(index),
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
        template={template}
        isOpen={openDeleteModal}
      />
    </>
  );
};

export default TemplateCard;

export const TemplateColors = {
  red: "bg-red-500 hover:bg-red-400",
  orange: "bg-orange-500 hover:bg-orange-400",
  amber: "bg-amber-500 hover:bg-amber-400",
  yellow: "bg-yellow-500 hover:bg-yellow-400",
  lime: "bg-lime-500 hover:bg-lime-400",
  green: "bg-green-500 hover:bg-green-400",
  emerald: "bg-emerald-500 hover:bg-emerald-400",
  teal: "bg-teal-500 hover:bg-teal-400",
  cyan: "bg-cyan-500 hover:bg-cyan-400",
  sky: "bg-sky-500 hover:bg-sky-400",
  blue: "bg-blue-500 hover:bg-blue-400",
  indigo: "bg-indigo-500 hover:bg-indigo-400",
  violet: "bg-violet-500 hover:bg-violet-400",
  purple: "bg-purple-500 hover:bg-purple-400",
  fuchsia: "bg-fuchsia-500 hover:bg-fuchsia-400",
  pink: "bg-pink-500 hover:bg-pink-400",
  rose: "bg-rose-500 hover:bg-rose-400",
};

function getColorByIndex(index: number): string {
  let temp = index;
  const colors = Object.values(TemplateColors);
  while (temp > colors.length) temp -= colors.length;

  return colors[temp] ?? TemplateColors.blue;
}
