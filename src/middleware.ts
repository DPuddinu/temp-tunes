import { pages } from "./components/MainLayout";

export { default } from "next-auth/middleware";

export const config = { matcher: pages.map(page => page.name) }