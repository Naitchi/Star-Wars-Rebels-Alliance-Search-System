import Hapi from '@hapi/hapi';
import axios from 'axios';

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
    path: '/starship',
    handler: async (request, h) => {
      console.log('in getAllStarships controller');
      const data: any = [];
      let i: boolean = true;
      let url: string = 'https://swapi.dev/api/starships/';
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

  server.route({
    method: 'GET',
    path: '/films',
    handler: async (request, h) => {
      console.log('in getAllFilms controller');
      const data: any = [];
      let i: boolean = true;
      let url: string = 'https://swapi.dev/api/films/';
      while (i) {
        const response = await axios.get(url);
        if (response.data.next) {
          url = response.data.next;
        } else {
          i = false;
        }
        data.push(...response.data.results);
      }
      console.log(data);
      return data;
    },
  });

  server.route({
    method: 'GET',
    path: '/people',
    handler: async (request, h) => {
      console.log('in getAllPeople  controller');
      const data: any = [];
      let i: boolean = true;
      let url: string = 'https://swapi.dev/api/people/';
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

  server.route({
    method: 'GET',
    path: '/planets',
    handler: async (request, h) => {
      console.log('in getAllPlanets controller');
      const data: any = [];
      let i: boolean = true;
      let url: string = 'https://swapi.dev/api/planets/';
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

  server.route({
    method: 'GET',
    path: '/species',
    handler: async (request, h) => {
      console.log('in getAllSpecies controller');
      const data: any = [];
      let i: boolean = true;
      let url: string = 'https://swapi.dev/api/species/';
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

  server.route({
    method: 'GET',
    path: '/vehicles',
    handler: async (request, h) => {
      console.log('in getAllVehicles controller');
      const data: any = [];
      let i: boolean = true;
      let url: string = 'https://swapi.dev/api/vehicles/';

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
