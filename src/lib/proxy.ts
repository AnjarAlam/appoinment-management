import { type NextRequest, NextResponse } from "next/server";
import { verifyJwt, AUTH_COOKIE } from "@/lib/auth";

/**
 * Default protected routes that require authentication.
 * Update this list to match your app's protected sections.
 */
const DEFAULT_PROTECTED_ROUTES = [
  "/orders",
  "/products",
  "/users",
  "/roles",
  "/dashboard",
  "/analytics",
  "/inventory",
  "/customers",
  "/categories",
  "/banners",
  "/brands",
  "/promotions",
  "/payments",
  "/shipping",
  "/returns",
  "/reviews",
  "/settings",
];

const DEFAULT_AUTH_ROUTES = ["/login", "/signup", "/forgot-password"];
const DEFAULT_PUBLIC_ROUTES = ["/"];

export type ProxyOptions = {
  protectedRoutes?: string[];
  authRoutes?: string[];
  publicRoutes?: string[];
  loginRedirect?: string;
  authenticatedRedirect?: string;
};

/**
 * Reusable server-side proxy/auth guard for Next.js.
 *
 * Usage: import { proxy } from '@/lib/proxy' and call inside middleware or other server handlers.
 */
export async function proxy(
  request: NextRequest,
  options: ProxyOptions = {}
): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname;

  const protectedRoutes = options.protectedRoutes ?? DEFAULT_PROTECTED_ROUTES;
  const authRoutes = options.authRoutes ?? DEFAULT_AUTH_ROUTES;
  const publicRoutes = options.publicRoutes ?? DEFAULT_PUBLIC_ROUTES;

  const loginRedirect = options.loginRedirect ?? "/login";
  const authenticatedRedirect = options.authenticatedRedirect ?? "/dashboard";

  const accessToken = request.cookies.get(AUTH_COOKIE)?.value;

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.includes(pathname);
  const isPublicRoute = publicRoutes.includes(pathname);

  // Validate token safely
  let isAccessTokenValid = false;
  try {
    isAccessTokenValid = Boolean(accessToken && (await verifyJwt(accessToken)));
  } catch (err) {
    isAccessTokenValid = false;
  }

  // If trying to access protected area without a valid token, redirect to login
  if (isProtectedRoute && !isAccessTokenValid) {
    return NextResponse.redirect(new URL(loginRedirect, request.url));
  }

  // If visiting auth page (login/signup) while already authenticated, redirect to main dashboard
  if (isAuthRoute && isAccessTokenValid) {
    return NextResponse.redirect(new URL(authenticatedRedirect, request.url));
  }

  // Public routes are allowed without checks
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Default: allow navigation (middleware can call this and continue to NextResponse.next())
  return NextResponse.next();
}

export default proxy;
