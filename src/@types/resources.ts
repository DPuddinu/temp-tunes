import common from '../../public/locales/en/common.json';
import home from '../../public/locales/en/home.json';
import landing from '../../public/locales/en/landing.json';
import modals from '../../public/locales/en/modals.json';
import playlists from '../../public/locales/en/playlists.json';
import search from '../../public/locales/en/search.json';
import templates from '../../public/locales/en/templates.json';

export const commonResources = { ...common } as const
export const homeResources = { ...home } as const
export const landingResources = { ...landing } as const
export const modalsResources = { ...modals } as const
export const playlistsResources = { ...playlists } as const
export const searchResources = { ...search } as const
export const templatesResources = { ...templates } as const

const resources = {
  common,
  home,
  landing,
  modals,
  playlists,
  search,
  templates
} as const;

export default resources;