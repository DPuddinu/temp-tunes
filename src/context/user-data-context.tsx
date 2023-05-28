import { useSession } from "next-auth/react";
import { createContext, useEffect, type ReactNode } from "react";
import { useStore } from "~/core/store";
import type { TagsObject } from "~/server/api/routers/prisma_router";
import { api } from "~/utils/api";

interface Data {
  tags: TagsObject | undefined;
}
const initialContext = {
  tags: undefined
};
export const UserDataContext = createContext<Data>(initialContext);

const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const { setTags: setStoreTags, tags: storeTags, user: storeUser, setUser } = useStore();

  // LOADING USER
  // prettier-ignore
  const { data: user } = api.user_router.getUserBySpotifyId.useQuery(
    { spotifyId: session?.user?.id}, 
    { 
      refetchOnWindowFocus: false, 
      enabled: session?.user?.id !== undefined,
      onSuccess(data) {
        if (!storeUser && user) {
          setUser(data.user);
          setStoreTags(data.tags);
        }
      }
    }
  )

  return (
    <UserDataContext.Provider
      value={{
        tags: storeTags
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export default UserDataProvider;
