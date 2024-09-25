import axios from 'axios';
import { Items } from '../types/types';

export async function getAll(name: string | undefined): Promise<Items | undefined> {
  if (!name) window.location.href = '/NotFound';
  const url: string = `http://localhost:3000/categories/${name}`;
  const headers = {}; // TODO faire l'authentification
  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (e) {
    console.error(JSON.stringify(e));
    window.location.href = '/NotFound';
  }
}

export async function getOneElement(name: string | undefined, id: number | string | undefined) {
  if (!name || !id) window.location.href = '/NotFound';
  const url = `http://localhost:3000/category/${name}/${id}`;
  const headers = {}; // TODO faire l'authentification
  try {
    const response = await axios.get(url, { headers });
    return response;
  } catch (e) {
    console.error(JSON.stringify(e));
    window.location.href = '/NotFound';
  }
}
