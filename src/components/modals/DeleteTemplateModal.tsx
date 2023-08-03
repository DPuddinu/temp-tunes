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
  isOpen: boolean;
} & BaseModalProps;

export const DeleteTemplateModal = ({ onClose, template, isOpen }: Props) => {
  const { t } = useTranslation("templates");
  const { setMessage } = useToast();
  const utils = api.useContext().template.getUserTemplates;

  const { mutate: deleteTemplate } = api.template.deleteTemplate.useMutation({
    async onMutate({ id }) {
      await utils.cancel();
      const prevData = utils.getData();

      //prettier-ignore
      utils.setData(undefined, (old) => old?.filter((t) => t.id !== id));
      return { prevData };
    },
    onError(error, variables, context) {
      utils.setData(undefined, context?.prevData);
      setMessage(`${t("delete_error")}`);
    },
    onSuccess() {
      setMessage(`${t("delete_success")}`);
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
