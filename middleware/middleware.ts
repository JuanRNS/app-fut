import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const publicRoutes = ["/login", "/register"];

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isPublicRoute = publicRoutes.includes(path);

    const cookie = req.cookies.get('session')?.value;

    if (!cookie) {
        if (isPublicRoute) {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL('/login', req.url));
    }

   if (cookie) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(cookie, secret);
      
      if (isPublicRoute) {
        return NextResponse.redirect(new URL('/', req.nextUrl));
      }
      
      return NextResponse.next();
    } catch (err) {
      const response = NextResponse.redirect(new URL('/login', req.nextUrl));
      response.cookies.delete('session');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}