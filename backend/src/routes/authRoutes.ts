import Hapi, { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';
import jwt from '@hapi/jwt';
import bcrypt from 'bcryptjs';

const JWT_SECRET = 'mySuperSecretKey123!'; // TODO mettre dans un .env sinon l'empire va s'en emparer 🤭

const userDB = {
  username: 'Luke',
  password: '$2a$10$I/raiBmPhmlOmeE1YHCvcuxdypZOhr.IFwQ.5vq/YRp44VyXVlq..',
};

// Fonction pour générer un token
const generateToken = (username: string): string => {
  const token = jwt.token.generate(
    { username },
    { key: JWT_SECRET, algorithm: 'HS256' }, // Clé et algorithme
  );
  return token;
};

const authRoutes: Hapi.ServerRoute[] = [
  {
    method: 'POST',
    path: '/login',
    handler: async (
      request: Request,
      h: ResponseToolkit,
    ): Promise<{ token: string } | ResponseObject> => {
      const { username, password } = request.payload as { username: string; password: string };
      const isPasswordValid = await bcrypt.compare(password, userDB.password);

      if (userDB.username === username && isPasswordValid) {
        const token = generateToken(username);
        return { token };
      }

      return h.response({ error: 'Invalid credentials' }).code(401);
    },
  },
];

export default authRoutes;
