import { useCallback, useEffect } from "react";
import { useTagsStore } from "~/core/store";
import { api } from "~/utils/api";

export function useTags() {

  const { setTags: setStoreTags, tags: storeTags } = useTagsStore();

  //prettier-ignore
  const { data: userTags, isLoading, isError, mutate } = api.prisma_router.getTagsByUser.useMutation();
  
  const load = useCallback(() => {
    if (!storeTags) mutate();
  }, [mutate, storeTags]);

  useEffect(() => {
    if(userTags)setStoreTags(userTags)
  }, [setStoreTags, userTags])

  return {
    tags: storeTags,
    fetchTags: load,
    isLoading: isLoading,
    isError: isError,
  };
}
