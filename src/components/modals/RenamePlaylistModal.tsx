import { useTranslation } from "next-i18next";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { api } from "~/utils/api";
import { ConfirmButtonGroup } from "../ui/ConfirmationButtonGroup";
import type { BaseModalProps } from "./BaseModal";
import BaseModal from "./BaseModal";

type Props = {
  setIsOpen: (open: boolean) => void;
  onConfirm: () => void;
  onSuccess: () => void;
  playlistID: string;
  playlistName: string;
} & BaseModalProps;

export function RenameModal({
  isOpen,
  onClose,
  onConfirm,
  onSuccess,
  setIsOpen,
  playlistID,
  playlistName,
}: Props) {
  const { t } = useTranslation("playlists");
  const ref = useRef<HTMLInputElement>(null);
  const [error, setError] = useState(" ");
  const [placeHolder, setPlaceHolder] = useState(playlistName)
  const { mutate } = api.spotify_playlist.rename.useMutation({
    onSuccess() {
      setIsOpen(false);
      onSuccess();
    },
  });

  useEffect(() => {
    setError(validateName(playlistName));
  }, [playlistName]);

  return (
    <BaseModal isOpen={isOpen} title={t("operations.rename")} onClose={onClose}>
      <div className="flex h-3/4 flex-col justify-between pt-4 text-black">
        <div className="text-lg font-medium text-neutral ">
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">What is your name?</span>
              <span className="label-text-alt">Top Right label</span>
            </label>
            <input
              tabIndex={-1}
              ref={ref}
              type="text"
              className="input-bordered input w-full max-w-xs text-white"
              placeholder={placeHolder ?? "..."}
              onChange={(event) => {
                setError(validateName(event.target.value));
                if(!!placeHolder)setPlaceHolder('')
              }}
            />
          </div>
        </div>
        <ConfirmButtonGroup
          disabledConfirm={!!error}
          onConfirm={() => {
            if (ref.current?.value) {
              mutate({ playlistID: playlistID, name: ref.current.value });
              onConfirm();
            }
          }}
          onClose={onClose}
        />
      </div>
    </BaseModal>
  );
}

function validateName(tagName: string) {
  let error = "";
  if (!z.string().min(3).safeParse(tagName).success || !tagName) {
    error = "tag_errors.short";
  }
  if (!z.string().max(18).safeParse(tagName).success) {
    error = "tag_errors.long";
  }
  return error;
}
