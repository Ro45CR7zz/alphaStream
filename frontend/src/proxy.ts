// No need to import NextResponse anymore, we use the standard Response object

const protectedRoutes = ['/dashboard'];

export default function proxy(request: Request) {
  const url = new URL(request.url);
  const { pathname } = url;

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    // In Phase 2, we will migrate the JWT to an HTTP-Only Cookie.
    // For now, this is the structural shell for intercepting routes using standard headers.
    
    // Check for our future cookie (using standard Request headers)
    const cookieHeader = request.headers.get('cookie');
    const hasSession = cookieHeader && cookieHeader.includes('alpha_session=');

    // If there is no session, violently redirect to the login page
    if (!hasSession) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      
      // We return a standard 307 Temporary Redirect response
      return Response.redirect(loginUrl, 307);
    }
  }

  // If we don't return a Response object, Next.js automatically proceeds with the request
}

// The config matcher stays exactly the same
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};