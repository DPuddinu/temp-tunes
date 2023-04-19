import { useSession } from "next-auth/react";
import { createContext, useEffect, type ReactNode } from "react";
import { useTags } from "~/hooks/use-tags";
import type { TagsObject } from "~/server/api/routers/prisma_router";

interface Data {
  tags: TagsObject | null;
}

export const UserDataContext = createContext<Data>({ tags: null });

const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const { tags, fetchTags } = useTags();
  const { data } = useSession();

  useEffect(() => {
    if (!tags && data?.accessToken) fetchTags();
  }, [data?.accessToken, fetchTags, tags]);

  return (
    <UserDataContext.Provider value={{ tags: tags ?? null }}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserDataProvider;
