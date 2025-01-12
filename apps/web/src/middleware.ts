import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const companyId = request.cookies.get('companyId')?.value || null;
    const token = request.cookies.get('token')?.value || null;
    const refreshToken = request.cookies.get('refreshToken')?.value || null;
    const sessionId = request.cookies.get('sessionId')?.value || null;
   
    const isPublic = pathname.includes("/auth");
    const isApi = pathname.includes("/api");

    
    if (token && refreshToken && sessionId) {
        if (isPublic) {
            return NextResponse.redirect(new URL('/inbox', request.url));
        }
        if(pathname === '/'){
            return NextResponse.redirect(new URL('/inbox', request.url));
        }

    }

    if (!token && !refreshToken && !sessionId) {
        if (!isPublic) {
            return NextResponse.redirect(new URL('/auth', request.url));
        }
        if(isApi) {
            return NextResponse.redirect(new URL('/auth', request.url));
        }
        if(pathname === '/'){
            return NextResponse.redirect(new URL('/auth', request.url));
        }
    }

    if (companyId && pathname === '/auth/company') {
        return NextResponse.redirect(new URL('/auth/signup', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
