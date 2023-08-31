import { type Template, type TemplateEntry } from "@prisma/client";
import { useTranslation } from "next-i18next";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/utils/api";
import { ConfirmButtonGroup } from "../ConfirmationButtonGroup";
import BaseModal, { type BaseModalProps } from "./BaseModal";

type Props = {
  template: Template & {
    templateEntries: TemplateEntry[];
  };
  isOpen: boolean;
} & BaseModalProps;

export const DeleteTemplateModal = ({ onClose, template, isOpen }: Props) => {
  const { t } = useTranslation("templates");
  const { setMessage } = useToast();
  const utils = api.useContext().template.getByCurrentUser;

  const { mutate: deleteTemplate } = api.template.delete.useMutation({
    onError() {
      setMessage(t("delete_error"));
    },
    async onSuccess() {
      setMessage(t("delete_success"));
      utils.invalidate();
      onClose();
    },
  });

  return (
    <BaseModal
      onClose={onClose}
      isOpen={isOpen}
      title={t("confirm_delete_title")}
    >
      <div>
        <p className="mt-2 text-lg text-base-content">
          <span>{t("confirm_delete_body")}</span>
          <b>{` ${template.name} `}</b>
          <span>?</span>
        </p>
        <ConfirmButtonGroup
          onConfirm={() => {
            deleteTemplate({
              entries: template.templateEntries.map((t) => t.id),
              id: template.id,
              userId: template.userId,
            });
          }}
          onClose={onClose}
        />
      </div>
    </BaseModal>
  );
};
