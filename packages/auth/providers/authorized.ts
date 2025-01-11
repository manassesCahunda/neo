import { v4 as uuidv4 } from 'uuid';
import { parseToken, validateToken } from '../config/index';
import { Adapter } from './authenticate';
import { authConfig } from './authorization';

interface Auth {
    refreshToken: string;
    token: string;
    sessionId: string;
}

export const authorized = async (auth?: Auth): Promise<any> => {
    const isSessionIdValid = auth?.sessionId ? validateToken(auth.sessionId) : false;
    const isRefreshTokenValid = auth?.refreshToken ? validateToken(auth.refreshToken) : false;
    const isTokenValid = auth?.token ? validateToken(auth.token) : false;

    if (!isSessionIdValid || !isRefreshTokenValid || !isTokenValid) {
        return { status: 401, message: "Unauthorized: Invalid or expired token" };
    }

    const parsedData = auth?.refreshToken ? parseToken(auth.refreshToken) : null;

    if (isTokenValid && isRefreshTokenValid) {
        const sessionId = authConfig.callbacks.session(auth.token, undefined);
        const idToken = uuidv4();

        const createSession = await Adapter.createSession(auth.token, auth.refreshToken, idToken, parsedData?.userId, "Auth");
        if (!createSession) {
            return { status: 401, message: "Unauthorized: Session creation failed" };
        }

        const createToken = await Adapter.createAccessToken(sessionId, false, idToken);
        if (!createToken) {
            return { status: 401, message: "Unauthorized: Token creation failed" };
        }

        return {
            status: 200,
            token: auth.token ?? "",
            sessionId,
            refreshToken: auth.refreshToken ?? "",
        };
    }

    if (isRefreshTokenValid) {
        const newToken = authConfig.callbacks.accessToken(auth.refreshToken, undefined);
        const sessionId = authConfig.callbacks.session(newToken, undefined);
        const idToken = uuidv4();

        const createSession = await Adapter.createSession(newToken, auth.refreshToken, idToken, parsedData?.userId, "Auth");
        if (!createSession) {
            return { status: 401, message: "Unauthorized: Session creation failed" };
        }

        const createToken = await Adapter.createAccessToken(sessionId, false, idToken);
        if (!createToken) {
            return { status: 401, message: "Unauthorized: Token creation failed" };
        }

        return {
            status: 200,
            token: newToken,
            sessionId,
            refreshToken: auth.refreshToken ?? "",
        };
    }

    return { status: 403, message: "Unauthorized access or no access required" };
};
