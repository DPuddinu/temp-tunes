import { Quicksand } from "@next/font/google";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { appWithTranslation } from "next-i18next";
import { type AppType } from "next/app";
import "~/styles/index.css";
import { api } from "~/utils/api";
import type { AppPropsWithLayout } from "../types/page-types";
const akshar = Quicksand({ subsets: ["latin"] });

import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    <SessionProvider session={session}>
      <style jsx global>{`
        html {
          font-family: ${akshar.style.fontFamily};
        }
      `}</style>
      {getLayout(<Component {...pageProps} />)}
    </SessionProvider>
  );
};

export default api.withTRPC(appWithTranslation(MyApp));
