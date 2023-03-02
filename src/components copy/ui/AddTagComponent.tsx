import { useTranslation } from "next-i18next";
import { useState } from "react";
import { z } from "zod";

interface Props {
  onAdd: (value: string) => void;
}
const AddTagComponent = ({ onAdd }: Props) => {
  const [tagName, setTagName] = useState("");
  const { t } = useTranslation("modals");

  function handleAddTad(tag: string) {
    setTagName("");
    onAdd(tag);
  }

  return (
    <div className="flex gap-2">
      <div className="w-full">
        <input
          type="text"
          placeholder=""
          className="input w-full max-w-xs"
          onChange={(t) => setTagName(t.target.value)}
        />
        {!validTag(tagName) && (
          <label className="label">
            <span className="label-text-alt">{t("tag_errors.generic")}</span>
          </label>
        )}
      </div>

      <button
        disabled={!validTag(tagName)}
        className="btn-circle btn border-transparent bg-accent-focus"
        onClick={() => handleAddTad(tagName)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="white"
          className="h-6 w-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>
    </div>
  );
};
function validTag(tag: string) {
  return z.string().min(3).max(18).safeParse(tag).success;
}

export default AddTagComponent;

//TODO specificare il messaggio di errore nelle varie casistiche(troppo corto, lungo, già usato)
