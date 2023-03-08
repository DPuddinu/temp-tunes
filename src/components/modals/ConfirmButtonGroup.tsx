import { useTranslation } from "next-i18next";
import type { BaseModalProps } from "./BaseModal";

export function ConfirmButtonGroup({ onConfirm, onClose }: BaseModalProps) {
  const { t } = useTranslation("modals");
  return (
    <div className="mt-4 flex flex-row-reverse gap-2">
      <button
        type="button"
        className="bg- inline-flex justify-center rounded-md border border-transparent bg-accent-focus px-4 py-2 text-white duration-300 "
        onClick={onConfirm}
      >
        {t("confirm")}
      </button>
      <button
        type="button"
        className="inline-flex justify-center rounded-md border border-transparent  bg-error px-4 py-2 text-white duration-300 "
        onClick={onClose}
      >
        {t("cancel")}
      </button>
    </div>
  );
}
