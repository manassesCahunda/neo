import { generateToken, isTokenExpired, parseToken, validateToken } from "../config/index";

const TOKEN_EXPIRATION = '3d';
const SESSION_EXPIRATION = '1h';
const REFRESH_TOKEN_EXPIRATION = '7d';

export const authConfig = {
  callbacks: {
    accessToken(refreshToken?: string, userData?: { name: string; userId: string; email: string; role: string }) {
      if (refreshToken && !validateToken(refreshToken)) {
        throw new Error('Refresh token is invalid or expired.');
      }

      const parsedData = refreshToken ? parseToken(refreshToken) : null;

      if (!userData && (!parsedData?.name || !parsedData?.userId || !parsedData?.email)) {
        throw new Error('Token or user data is invalid or incomplete.');
      }

      const accessToken = generateToken({
        userId: userData?.userId || parsedData?.userId,
        name: userData?.name || parsedData?.name,
        email: userData?.email || parsedData?.email,
        role: userData?.role || parsedData?.role,
        expired: TOKEN_EXPIRATION,
      });

      return accessToken ?? null;
    },

    refreshToken(userData: { name: string; email: string; userId: string; role: string }) {
      
      const refreshToken = generateToken({
        email: userData.email || "",
        name: userData.name,
        userId: userData.userId,
        role: userData.role,
        expired: REFRESH_TOKEN_EXPIRATION,
      });

      if (!refreshToken) {
        throw new Error('Failed to generate refresh token due to invalid user data.');
      }

      return refreshToken;
    },

    session(accessToken?: string, userData?: { name: string; userId: string; email: string; role: string }) {
      if (accessToken && !validateToken(accessToken)) {
        throw new Error('Access token is invalid or expired.');
      }

      const parsedData = accessToken ? parseToken(accessToken) : null;

      if (!userData && (!parsedData?.name || !parsedData?.userId || !parsedData?.email)) {
        throw new Error('Token or user data is invalid or incomplete.');
      }

      const newAccessToken = generateToken({
        userId: userData?.userId || parsedData?.userId,
        name: userData?.name || parsedData?.name,
        email: userData?.email || parsedData?.email,
        role: userData?.role || parsedData?.role,
        expired: SESSION_EXPIRATION,
      });

      return newAccessToken ?? null;
    },
  },
};
