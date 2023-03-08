import type { Tag } from "@prisma/client";
import { useTranslation } from "next-i18next";
import { useCallback, useState } from "react";
import { z } from "zod";
import LoadingModal from "../modals/LoadingModal";

interface Props {
  onAdd: (tagName: string) => void;
  tags: Tag[];
}
const AddTagComponent = ({ onAdd, tags }: Props) => {
  const [tagName, setTagName] = useState("");
  const [error, setError] = useState("");
  const { t } = useTranslation("modals");

  function handleAddTag(tag: string) {
    setTagName("");
    onAdd(tag);
  }
  //prettier-ignore
  const validateTag = useCallback((tagName: string) => {
      setError("");

      if (!z.string().min(3).safeParse(tagName).success) {
        setError("tag_errors.short");
      }
      if (!z.string().max(18).safeParse(tagName).success) {
        setError("tag_errors.long");
      }
      if (tags.map((tag) => tag.name.toLowerCase()).includes(tagName.toLowerCase())) {
        setError("tag_errors.used");
      }
    },
    [tagName, tags.length]
  );

  const handleTagChange = (tagName: string) => {
    setTagName(() => {
      validateTag(tagName);
      return tagName;
    });
  };
  return (
    <div className="flex gap-2">
      <div className="w-full">
        <input
          type="text"
          placeholder=""
          className="input w-full max-w-xs"
          value={tagName}
          onChange={(t) => handleTagChange(t.target.value)}
        />
        {!!error && (
          <label className="label text-red-700">
            <span className="label-text-alt font-bold text-base-100">
              {t(error)}
            </span>
          </label>
        )}
      </div>

      <button
        disabled={!!error}
        className="btn-circle btn border-transparent bg-accent-focus"
        onClick={() => handleAddTag(tagName)}
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

export default AddTagComponent;

//TODO specificare il messaggio di errore nelle varie casistiche(troppo corto, lungo, già usato)
