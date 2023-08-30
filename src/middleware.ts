import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized({ token }) {
      const expired = token === null || new Date() > new Date(token.expiresIn)
      return !expired
    },
  },
})

export const config = { matcher: ["/home", "/search", "/playlist/:path*", "/templates/:path*"] }