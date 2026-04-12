import NextAuth from "next-auth";
import createMiddleware from "next-intl/middleware";

import { authConfig } from "@/lib/auth/config";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const intlResponse = intlMiddleware(req);
  if (intlResponse) return intlResponse;

  if (!req.auth && req.nextUrl.pathname.match(/^\/(en|es)\/admin/)) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return Response.redirect(loginUrl);
  }

  return;
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
