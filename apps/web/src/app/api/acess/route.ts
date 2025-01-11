import { cookies } from 'next/headers';
import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { serverClient } from '@/lib/trpc/server';

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    const companyId = url.searchParams.get("companyId") || null;

    if (!token) {
        return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    try {
        const providerToken = await serverClient.validateSession({ sessionToken: token });

        if (!providerToken) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const cookieStore = await cookies();
        const cookieOptions = {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 3,
        };

        if (cookieStore.has('token')) {
            cookieStore.delete('token');
        }
        if (cookieStore.has('refreshToken')) {
            cookieStore.delete('refreshToken');
        }
        if (cookieStore.has('companyId')) {
            cookieStore.delete('companyId');
        }
        if (cookieStore.has('role')) {
            cookieStore.delete('role');
        }

        if (companyId) {
            cookieStore.set('companyId', companyId, cookieOptions);
            cookieStore.set('role', "member", cookieOptions);
            return NextResponse.redirect(new URL('/auth/signup', req.url));
        }

        if (!companyId) {
            cookieStore.set('token', providerToken.token, cookieOptions);
            cookieStore.set('refreshToken', providerToken.refreshToken, {
                ...cookieOptions,
                maxAge: 60 * 60 * 24 * 7,
            });

            return NextResponse.redirect(new URL('/inbox', req.url));
        }

        return NextResponse.json({}, { status: 200 });

    } catch (error) {
        console.error("Error validating token:", {
            message: error.message,
            stack: error.stack,
            token,
        });

        return NextResponse.json({ error: 'Failed to validate token' }, { status: 500 });
    }
}
