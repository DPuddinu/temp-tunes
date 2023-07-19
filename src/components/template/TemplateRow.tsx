import { type PlaylistTemplate, type TemplateEntry } from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "~/utils/utils";
import { DeleteTemplateModal } from "../modals/DeleteTemplateModal";
import DropdownMenu from "../ui/DropdownMenu";
import { ArrowSVG } from "../ui/icons";

type templateRowProps = {
  template: PlaylistTemplate & {
    templateEntries: TemplateEntry[];
  };
  index: number;
};
const TemplateRow = ({ template, index }: templateRowProps) => {
  const { name, description, templateEntries, id } = template;
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { t } = useTranslation("common");

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  return (
    <>
      <div className="rounded-box h-fit bg-base-200 p-2 px-4 shadow hover:cursor-pointer">
        <div className="flex items-center justify-between">
          <div
            className="grow truncate"
            onClick={() => setOpen((open) => !open)}
          >
            <h2 className="truncate text-xl sm:text-3xl">{name}</h2>
            <p className="truncate text-sm">{description}</p>
          </div>

          <DropdownMenu
            intent={"darkest"}
            direction={index > 3 ? "up" : "down"}
          >
            <DropdownMenu.Options
              options={[
                {
                  label: t("edit"),
                  onClick: () => router.push(`/templates/${id}`),
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
        </div>

        <div
          key={name}
          className={cn(
            "collapse rounded-md mt-2  bg-base-100",
            open ? "block" : "hidden"
          )}
        >
          <input type="checkbox" checked={open} disabled className="hidden" />
          <div className="collapse-content p-1 px-2">
            <div>
              {templateEntries.map(({ entry, id }, i) => (
                <p key={id}>
                  {i + 1}
                  {`) `}
                  {entry}
                </p>
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
      </div>
      <DeleteTemplateModal
        onClose={() => setOpenDeleteModal(true)}
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
export default TemplateRow;
