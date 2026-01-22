import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const publicRoutes = ["/", "/login", "/register",];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const path = pathname.endsWith('/') && pathname !== '/'
    ? pathname.slice(0, -1)
    : pathname;

  const isPublicRoute = publicRoutes.includes(path);
  const cookie = req.cookies.get('session')?.value;

  if (isPublicRoute) {
    if (cookie) {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        await jwtVerify(cookie, secret);
        return NextResponse.redirect(new URL('/home', req.nextUrl));
      } catch (err) {
        const response = NextResponse.next();
        response.cookies.delete('session');
        return response;
      }
    }
    return NextResponse.next();
  }

  if (!cookie) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(cookie, secret);
    return NextResponse.next();
  } catch (err) {
    const response = NextResponse.redirect(new URL('/login', req.nextUrl));
    response.cookies.delete('session');
    return response;
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}