import { Request, ResponseToolkit } from '@hapi/hapi';

const JWT_SECRET: string = 'mySuperSecretKey123!'; // TODO mettre dans un .env sinon l'empire va s'en emparer 🤭

export const jwtAuthStrategy = {
  keys: JWT_SECRET,
  verify: {
    aud: false,
    iss: false,
    sub: false,
  },
  validate: (
    artifacts: {
      decoded: {
        payload: {
          username: string;
          aud?: string;
          exp?: number;
          maxAgeSec: 14400; // 4 heures
        };
      };
    },
    request: Request,
    h: ResponseToolkit,
  ) => {
    const currentTime: number = Math.floor(Date.now() / 1000);
    const tokenExpiration: number | undefined = artifacts.decoded.payload.exp;
    if (tokenExpiration && tokenExpiration < currentTime) {
      return { isValid: false };
    }
    return { isValid: true, credentials: artifacts.decoded.payload };
  },
};
