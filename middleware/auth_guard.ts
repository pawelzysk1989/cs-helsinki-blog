import { Request } from 'express';
import { auth } from 'express-oauth2-jwt-bearer';

import config from '../utils/config';

declare module 'express-oauth2-jwt-bearer' {
  interface JWTPayload {
    ['https://blog-app.com']: {
      user_id: string;
    };
  }
}

export const getUserId = (authOptions: Request['auth']) => {
  return authOptions?.payload['https://blog-app.com'].user_id;
};

const authGuard = auth({
  audience: config.AUTH_AUDIENCE,
  issuerBaseURL: config.AUTH_ISSUER_URL,
  tokenSigningAlg: 'RS256',
});

export default authGuard;
