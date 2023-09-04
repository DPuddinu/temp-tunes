import type { ReactNode } from "react";
import {
  HomeSVG,
  PlaylistSVG,
  SearchSVG,
  TemplateSVG,
} from "../ui/icons/index";

type PageType = "Home" | "Search" | "Playlists" | "Templates";

interface Page {
  url: string;
  name: PageType;
  icon: ReactNode;
}

export const pages: Page[] = [
  { url: "/home", name: "Home", icon: <HomeSVG /> },
  { url: "/search", name: "Search", icon: <SearchSVG /> },
  { url: "/playlist", name: "Playlists", icon: <PlaylistSVG /> },
  { url: "/templates", name: "Templates", icon: <TemplateSVG /> },
];