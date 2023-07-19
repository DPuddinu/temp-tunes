import { useTranslation } from "next-i18next";
import { useToast } from "~/hooks/use-toast";
import type { Playlist } from "~/types/spotify-types";
import { api } from "~/utils/api";
import type { TemplateFormType } from "../template/CreateTemplate";
import { ConfirmButtonGroup } from "../ui/ConfirmationButtonGroup";
import BaseModal, { type BaseModalProps } from "./BaseModal";

type Props = {
  template: TemplateFormType;
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
      // setTimeout(() => {
      //   window.dispatchEvent(new Event("focus"));
      // }, 300);
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
        <p>{t("confirm_delete_body")}</p>
        <ConfirmButtonGroup
          onConfirm={() => {
            deleteTemplate({
              entries: template.entries?.map((t) => t.id ?? ""),
              id: template.id ?? "",
            });
            // onConfirm();
          }}
          onClose={onClose}
        />
      </div>
    </BaseModal>
  );
};
