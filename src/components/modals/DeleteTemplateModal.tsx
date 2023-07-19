import { type PlaylistTemplate, type TemplateEntry } from "@prisma/client";
import { useTranslation } from "next-i18next";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/utils/api";
import { ConfirmButtonGroup } from "../ui/ConfirmationButtonGroup";
import BaseModal, { type BaseModalProps } from "./BaseModal";

type Props = {
  template: PlaylistTemplate & {
    templateEntries: TemplateEntry[];
  };
  onSuccess: () => void;
  setIsOpen: (open: boolean) => void;
} & BaseModalProps;

export const DeleteTemplateModal = ({
  onClose,
  onSuccess,
  template,
  setIsOpen,
  isOpen,
}: Props) => {
  const { t } = useTranslation("templates");
  const { setMessage } = useToast();

  const { mutate: deleteTemplate } = api.template.deleteTemplate.useMutation({
    onError() {
      const msg = t("delete_error");
      setMessage(msg);
    },
    onSuccess() {
      const msg = t("delete_success");
      setMessage(msg);
      setIsOpen(false);
      onSuccess();
    },
  });

  return (
    <BaseModal
      onClose={onClose}
      isOpen={isOpen}
      title={t("confirm_delete_title")}
    >
      <div>
        <p className="mt-2 text-lg text-black">
          <span>{`${t("confirm_delete_body")} `}</span>
          <b>{`${template.name} `}</b>
          <span>?</span>
        </p>
        <ConfirmButtonGroup
          onConfirm={() => {
            deleteTemplate({
              entries: template.templateEntries.map((t) => t.id),
              id: template.id,
            });
          }}
          onClose={onClose}
        />
      </div>
    </BaseModal>
  );
};
