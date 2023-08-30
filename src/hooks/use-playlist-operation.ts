import { useTranslation } from "next-i18next";
import { useState } from "react";
import { api } from "~/utils/api";
import { useToast } from "./use-toast";

export const usePlaylistOperations = (playlistName: string) => {

  const [isLoading, setIsLoading] = useState(false);
  const utils = api.useContext().spotify_playlist.getAll;

  const { t } = useTranslation("playlists");
  const { t: t_common } = useTranslation("common");
  const { setMessage } = useToast();

  const shuffle = api.spotify_playlist.shuffle.useMutation({
    onMutate() {
      setIsLoading(true);
    },
    onSuccess() {
      setMessage(`${playlistName} ${t("operations.shuffled")}`);
      setIsLoading(false);
    },
    onError() {
      setMessage(t_common("error"));
    },
  });
  const copy = api.spotify_playlist.copy.useMutation({
    onSuccess() {
      setMessage(`${playlistName} ${t("operations.copied")}`);
      utils.invalidate()
      setIsLoading(false);
    },
    onError() {
      setMessage(t_common("error"));
    },
  });
  const merge = api.spotify_playlist.merge.useMutation({
    onMutate() {
      setIsLoading(true);
    },
    onSuccess() {
      setMessage(`${playlistName} ${t("operations.merge")}`);
      setIsLoading(false);
    },
    onError() {
      setMessage(t_common("error"));
    },
  });

  const remove = api.spotify_playlist.remove.useMutation({
    async onMutate({ playlistID }) {
      await utils.cancel();
      const prevData = utils.getData();

      //prettier-ignore
      utils.setData(undefined, (old) => old?.filter((t) => t.id !== playlistID));

      return { prevData };
    },
    onSuccess() {
      const msg = `${t("operations.removed")} ${playlistName} ${t(
        "operations.confirm_2"
      )}`;
      setMessage(msg);
    },
    onError(_, __, context) {
      utils.setData(undefined, context?.prevData);
      setMessage(t_common("error"));
    },
  });

  const rename = api.spotify_playlist.rename.useMutation({
    async onMutate({ name, playlistID }) {
      await utils.cancel();
      const prevData = utils.getData();

      //prettier-ignore
      utils.setData(undefined, (old) => {
        if (old) {
          const newList = old.map((t) => {
            if (t.id === playlistID) {
              t.name = name;
            }
            return t
          })
          return newList;
        }
      });
      return { prevData };
    },
    onSuccess() {
      setMessage(`Playlist ${t("operations.renamed")}`);
    },
    onError(_, __, context) {
      utils.setData(undefined, context?.prevData);
      setMessage(t_common("error"));
    },
  });

  return {
    isLoading,
    merge,
    copy,
    shuffle,
    remove,
    rename
  }
}
