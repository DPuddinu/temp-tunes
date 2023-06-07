import { Quicksand } from "@next/font/google";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { appWithTranslation } from "next-i18next";
import { type AppType } from "next/app";
import "~/styles/index.css";
import { api } from "~/utils/api";
import { themesList, type AppPropsWithLayout } from "../types/page-types";
const akshar = Quicksand({ subsets: ["latin"] });

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import UserDataProvider from "~/context/user-data-context";
import "~/styles/globals.css";

const queryClient = new QueryClient();
const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider themes={themesList} defaultTheme={"dark"}>
          <UserDataProvider>
            <style jsx global>{`
              html {
                font-family: ${akshar.style.fontFamily};
              }
            `}</style>
            {getLayout(<Component {...pageProps} />)}
          </UserDataProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(appWithTranslation(MyApp));
