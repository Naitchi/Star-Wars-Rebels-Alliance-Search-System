import jwt from '@hapi/jwt';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import Hapi, { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';

// Types
import { Items } from './types/types';

const JWT_SECRET = 'mySuperSecretKey123!'; // TODO mettre dans un .env sinon l'empire va s'en emparer 🤭

const userDB = {
  username: 'Luke',
  password: '$2a$10$I/raiBmPhmlOmeE1YHCvcuxdypZOhr.IFwQ.5vq/YRp44VyXVlq..',
};

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['http://localhost:5173'], // Autorise le frontend
        credentials: true,
      },
    },
  });

  await server.register(jwt);

  // Défini une stratégie d'authentification
  server.auth.strategy('jwt', 'jwt', {
    keys: JWT_SECRET,
    verify: {
      aud: false,
      iss: false,
      sub: false,
    },
    validate: (artifacts, request, h) => {
      const currentTime = Math.floor(Date.now() / 1000);
      const tokenExpiration = artifacts.decoded.payload.exp;
      if (tokenExpiration && tokenExpiration < currentTime) {
        return { isValid: false };
      }
      return { isValid: true, credentials: artifacts.decoded.payload };
    },
  });

  // Fonction pour générer un token
  const generateToken = (username: string) => {
    const token = jwt.token.generate(
      { username },
      { key: JWT_SECRET, algorithm: 'HS256' }, // Clé et algorithme
    );
    return token;
  };

  server.route({
    method: 'POST',
    path: '/login',
    handler: async (request, h) => {
      const { username, password } = request.payload as { username: string; password: string };
      const isPasswordValid = await bcrypt.compare(password, userDB.password);

      if (userDB.username === username && isPasswordValid) {
        const token = generateToken(username);
        return { token };
      }

      return h.response({ error: 'Invalid credentials' }).code(401);
    },
  });

  server.route({
    method: 'GET',
    path: '/status',
    handler: (request, h) => {
      return { status: 'OK', message: 'Le serveur fonctionne correctement!' };
    },
  });

  server.route({
    method: 'GET',
    path: '/category/{name}/{id}',
    options: {
      auth: 'jwt',
    },
    handler: async (request: Request, h: ResponseToolkit): Promise<ResponseObject | undefined> => {
      const { name, id } = request.params;
      if (!name || !id)
        return h.response({ error: 'Le paramètre "name" et "id" sont requis.' }).code(400);
      console.log(`in GetOne-${name} controller`);
      const url: string = `https://swapi.dev/api/${name}/${id}/`;
      try {
        const response = await axios.get(url);
        return response.data;
      } catch (e) {
        console.error(e);
      }
    },
  });

  server.route({
    method: 'GET',
    path: '/categories/{name}',
    options: {
      auth: 'jwt',
    },
    handler: async (request: Request, h: ResponseToolkit) => {
      const name = request.params.name;
      if (!name) return h.response({ error: 'Le paramètre "name" est requis.' }).code(400);

      console.log(`in ${name} controller`);
      const data: Items = [];
      let url: string = `https://swapi.dev/api/${name}/`;
      let i: boolean = true;
      while (i) {
        const response = await axios.get(url);
        if (response.data.next) {
          url = response.data.next;
        } else {
          i = false;
        }
        data.push(...response.data.results);
      }
      return data;
    },
  });

  await server.start();
  console.log(`Serveur en cours d'exécution à l'adresse : ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
