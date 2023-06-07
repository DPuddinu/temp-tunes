import { useTranslation } from "next-i18next";

interface ConfirmButtonGroupProps {
  onClose?: () => void;
  onConfirm?: () => void;
  disabledConfirm?: boolean;
}
export function ConfirmButtonGroup({
  onConfirm,
  onClose,
  disabledConfirm = false
}: ConfirmButtonGroupProps) {
  const { t } = useTranslation("modals");
  return (
    <div className="mt-4 mb-4 flex w-full flex-row-reverse gap-2 xxs:flex-wrap">
      <button
        disabled={disabledConfirm}
        tabIndex={-1}
        className="btn w-1/2 border-none bg-emerald-600 font-semibold text-black hover:bg-green-500 sm:w-40 xxs:w-full"
        onClick={onConfirm}
      >
        {t("confirm")}
      </button>
      <button
        tabIndex={-1}
        className="btn w-1/2 border-none bg-red-600 bg-opacity-90 font-semibold  text-black hover:bg-red-500 sm:w-40 xxs:w-full"
        onClick={onClose}
      >
        {t("cancel")}
      </button>
    </div>
  );
}
