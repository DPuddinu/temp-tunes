import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { appWithTranslation } from "next-i18next";
import { ThemeProvider } from "next-themes";
import { type AppType } from "next/app";
import { Quicksand } from "next/font/google";
import "~/styles/globals.css";
import { api } from "~/utils/api";
import { themesList, type AppPropsWithLayout } from "../types/page-types";
const akshar = Quicksand({ subsets: ["latin"] });

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <SessionProvider session={session}>
      <ThemeProvider themes={themesList} defaultTheme={"dark"}>
          <style jsx global>{`
            html {
              font-family: ${akshar.style.fontFamily};
            }
          `}</style>
          {getLayout(<Component {...pageProps} />)}
      </ThemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(appWithTranslation(MyApp));
