import { useTranslation } from "next-i18next";

interface ConfirmButtonGroupProps {
  onClose?: () => void;
  onConfirm?: () => void;
}
export function ConfirmButtonGroup({
  onConfirm,
  onClose,
}: ConfirmButtonGroupProps) {
  const { t } = useTranslation("modals");
  return (
    <div className="mt-4 mb-4 flex flex-row-reverse gap-2">
      <button
        tabIndex={-1}
        className="btn w-40 border-none bg-emerald-600 font-semibold text-black hover:bg-green-500"
        onClick={onConfirm}
      >
        {t("confirm")}
      </button>
      <button
        tabIndex={-1}
        className="btn w-40 border-none bg-red-600 bg-opacity-90  font-semibold text-black"
        onClick={onClose}
      >
        {t("cancel")}
      </button>
    </div>
  );
}
