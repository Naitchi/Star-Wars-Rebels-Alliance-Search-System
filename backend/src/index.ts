import Hapi from '@hapi/hapi';
import axios from 'axios';
import { Items } from './types/types';

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
    handler: async (request, h) => {
      const { name, id } = request.params;
      if (!name || !id)
        return h.response({ error: 'Le paramètre "name" et "id" sont requis.' }).code(400);

      console.log(`in ${name} controller`);
      const url: string = `https://swapi.dev/api/${name}/${id}`;
      const response = await axios.get(url);
      return response.data;
    },
  });

  server.route({
    method: 'GET',
    path: '/categories/{name}',
    handler: async (request, h) => {
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
