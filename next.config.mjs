// @ts-check

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    domains: [
      "mosaic.scdn.co",
      "newjams-images.scdn.co",
      "i.scdn.co",
      "wrapped-images.spotifycdn.com",
      "lineup-images.scdn.co",
      "images-ak.spotifycdn.com",
    ],
  },
  /**
   * If you have the "experimental: { appDir: true }" setting enabled, then you
   * must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    localeDetection: false,
    locales: ["en", "it"],
    defaultLocale: "en",
  },
};
export default config;
