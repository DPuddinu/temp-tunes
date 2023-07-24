import type { NextPage } from "next";
import type { AppProps } from "next/app";
import type { ReactElement, ReactNode } from "react";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};
export type PageWithLayout = {
  getLayout?: (page: ReactElement) => ReactNode;
  title?: string
};
export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export const themesList = ["dark", "light"];
export const themes = [...themesList] as const;
export type Theme = (typeof themes)[number];