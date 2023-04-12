import { Quicksand } from "@next/font/google";
import { type Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import { appWithTranslation } from "next-i18next";
import { type AppType } from "next/app";
import "~/styles/index.css";
import { api } from "~/utils/api";
import { type AppPropsWithLayout, themesList } from "../types/page-types";
const akshar = Quicksand({ subsets: ["latin"] });

import "~/styles/globals.css";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient()
const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider themes={themesList}>
        <SessionProvider session={session}>
          <style jsx global>{`
            html {
              font-family: ${akshar.style.fontFamily};
            }
          `}</style>
          {getLayout(<Component {...pageProps} />)}
        </SessionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default api.withTRPC(appWithTranslation(MyApp));
