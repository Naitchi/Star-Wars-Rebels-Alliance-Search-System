import Hapi, { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';
import axios, { AxiosResponse } from 'axios';
import { Item, Items } from '../types/types';

const categoryRoutes: Hapi.ServerRoute[] = [
  // route pour savoir si le serveur marche bien
  {
    method: 'GET',
    path: '/status',
    handler: (request: Request, h: ResponseToolkit) => {
      return { status: 'OK', message: 'Le serveur fonctionne correctement!' };
    },
  },
  // route pour récupérer un élément spécifique d'une catégorie spécifique dans SWAPI
  {
    method: 'GET',
    path: '/category/{name}/{id}',
    options: {
      auth: 'jwt',
    },
    handler: async (request: Request, h: ResponseToolkit): Promise<ResponseObject | Item> => {
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
        throw e;
      }
    },
  },
  // route pour récupérer une catégorie spécifique dans SWAPI
  {
    method: 'GET',
    path: '/categories/{name}',
    options: {
      auth: 'jwt',
    },
    handler: async (request: Request, h: ResponseToolkit): Promise<Hapi.ResponseObject | Items> => {
      const name = request.params.name;
      if (!name) return h.response({ error: 'Le paramètre "name" est requis.' }).code(400);

      console.log(`in ${name} controller`);
      const data: Items = [];
      let url: string = `https://swapi.dev/api/${name}/`;
      let i: boolean = true;
      while (i) {
        const response: AxiosResponse = await axios.get(url);
        if (response.data.next) {
          url = response.data.next;
        } else {
          i = false;
        }
        data.push(...response.data.results);
      }
      return data;
    },
  },
];

export default categoryRoutes;
