import { createContext, type ReactNode } from "react";
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
  const { setTags: setStoreTags, user: storeUser, setUser } = useStore();

  // LOADING USER
  // prettier-ignore
  const { data: user } = api.user_router.getUserBySpotifyId.useQuery(
    undefined, 
    { 
      refetchOnWindowFocus: false, 
      enabled: !storeUser,
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
        tags: user?.tags ?? {}
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export default UserDataProvider;
