import { useTranslation } from "next-i18next";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { z } from "zod";
import { useStore } from "~/core/store";
import useMediaQuery from "~/hooks/use-media-query";
import type { Track } from "~/types/spotify-types";
import type { TagSchemaType, TagType } from "~/types/zod-schemas";
import { api } from "~/utils/api";
import { ConfirmButtonGroup } from "../ui/ConfirmationButtonGroup";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { PlusSVG } from "../ui/icons/PlusSVG";
import type { BaseModalProps } from "./BaseModal";
import BaseModal from "./BaseModal";
import { BottomModal } from "./BottomModal";

type Props = {
  track: Track;
  playlistName?: string;
  tagType: TagType;
} & BaseModalProps;

export function TagModal({
  isOpen,
  onClose,
  track,
}: Props) {
  const { t } = useTranslation("modals");
  const [removeTags, setRemoveTags] = useState<TagSchemaType[]>([]);
  const { tags: storeTags, setTags: setStoreTags } = useStore();
  const [tags, setTags] = useState<TagSchemaType[]>([]);
  const sm = useMediaQuery('(min-width: 640px)')
  //prettier-ignore
  const { data, isLoading, isSuccess, mutate, isError } = api.prisma_router.setTags.useMutation();

  useEffect(() => {
    if (storeTags && track.id) {
      const tags = storeTags[track.id];
      setTags(tags !== undefined ? tags : []);
    }
  }, [storeTags, track.id]);

  useEffect(() => {
    if (data) setStoreTags(data);
  }, [data, isSuccess, setStoreTags]);

  const saveTags = useCallback(() => {
    mutate({ addTags: tags, removeTags: removeTags });
    onClose();
  },[mutate, onClose, removeTags, tags]);  

  const addTag = useCallback((tagName: string) => {
    if (track.id) {
      const newTag: TagSchemaType = {
        name: tagName,
        spotifyId: track.id,
      };

      setTags((oldTags) => {
        return [...oldTags, newTag];
      });
    }
  }, [track.id]);
  
  const removeTag = useCallback((i: number) => {
      const tagToRemove = tags[i] as TagSchemaType;
      setRemoveTags((oldTags) => {
        return [...oldTags, tagToRemove];
      });
      setTags((oldTags) => {
        const temp = [...oldTags];
        if (i > -1) {
          temp.splice(i, 1);
        }
        return temp;
      });
  }, [tags])
  
  const ModalBody = useMemo(
    () => (
      <>
        <div className="flex flex-row flex-wrap gap-2 pb-2">
          {tags.map((tag, i) => (
            <div className="indicator" key={self.crypto.randomUUID()}>
              <span
                className="badge indicator-item h-5 w-5 cursor-pointer pb-[2px] text-white"
                onClick={() => removeTag(i)}
              >
                <p className=" m-0 text-center">x</p>
              </span>
              <p className="w-fit rounded-3xl bg-warning pr-3 pl-3 text-white">
                {tag.name}
              </p>
            </div>
          ))}
        </div>

        <AddTagComponent
          onAdd={(tagName: string) => addTag(tagName)}
          tags={tags}
        />
        <div
          className="flex justify-between"
          style={{ justifyContent: isLoading ? "space-between" : "end" }}
        >
          {isLoading && <LoadingSpinner />}
          <ConfirmButtonGroup onConfirm={saveTags} onClose={onClose} />
        </div>
      </>
    ),
    [addTag, isLoading, onClose, removeTag, saveTags, tags]
  );

  return (
    <>
      {sm ? (
        <BaseModal isOpen={isOpen} title={t("new_tag")} onClose={onClose}>
          {ModalBody}
        </BaseModal>
      ) : (
        <BottomModal isOpen={isOpen} title={t("new_tag")} onClose={onClose}>
          {ModalBody}
        </BottomModal>
      )}
    </>
  );
}
interface AddTagProps {
  onAdd: (tagName: string) => void;
  tags: TagSchemaType[];
}
function AddTagComponent({ onAdd, tags }: AddTagProps) {
  const tagNameRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState(" ");
  const { t } = useTranslation("modals");

  return (
    <div className="flex gap-2 pt-2">
      <div className="w-full ">
        <input
          tabIndex={-1}
          ref={tagNameRef}
          type="text"
          className="input w-full "
          onChange={(event) => {
            setError(validateTag(event.target.value, tags));
          }}
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
        className="btn-circle btn border-transparent  transition-transform"
        onClick={() => {
          if (tagNameRef.current) {
            onAdd(tagNameRef.current.value);
            tagNameRef.current.value = "";
          }
        }}
      >
        <PlusSVG/>
      </button>
    </div>
  );
}

function validateTag(tagName: string, tags: TagSchemaType[]) {
  let error = "";
  if (!z.string().min(3).safeParse(tagName).success || !tagName) {
    error = "tag_errors.short";
  }
  if (!z.string().max(18).safeParse(tagName).success) {
    error = "tag_errors.long";
  }
  if (
    tags.map((tag) => tag.name.toLowerCase()).includes(tagName.toLowerCase())
  ) {
    error = "tag_errors.used";
  }
  return error;
}