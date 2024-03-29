import { useTranslation } from "next-i18next";

interface ConfirmButtonGroupProps {
  onClose?: () => void;
  onConfirm?: () => void;
  disabledConfirm?: boolean;
}
export function ConfirmButtonGroup({
  onConfirm,
  onClose,
  disabledConfirm = false,
}: ConfirmButtonGroupProps) {
  const { t } = useTranslation("common");
  return (
    <div className="mt-4 mb-4 flex w-full flex-row-reverse gap-2 xxs:flex-wrap">
      <button
        type="submit"
        disabled={disabledConfirm}
        tabIndex={-1}
        className="btn grow border-none bg-emerald-600 font-semibold text-black hover:bg-emerald-500 active:bg-emerald-500 sm:w-40 xxs:w-full"
        onClick={onConfirm}
      >
        {t("confirm")}
      </button>
      <button
        type="button"
        tabIndex={-1}
        className="btn grow border-none bg-red-600 bg-opacity-90 font-semibold text-black  hover:bg-red-500 active:bg-red-500 sm:w-40 xxs:w-full"
        onClick={onClose}
      >
        {t("cancel")}
      </button>
    </div>
  );
}
