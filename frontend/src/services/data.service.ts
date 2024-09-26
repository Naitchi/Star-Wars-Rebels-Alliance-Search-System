import axios from 'axios';
import { Item, Items } from '../types/types';
import { getToken } from './auth.service';

export async function getAll(name: string | undefined): Promise<Items | undefined> {
  if (!name) window.location.href = '/NotFound';
  const token = getToken();
  if (!token) {
    console.error('Token expiered');
    window.location.href = '/';
  }
  const url: string = `http://localhost:3000/categories/${name}`;
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (e) {
    console.error(JSON.stringify(e));
  }
}

export async function getOneElement(
  name: string | undefined,
  id: number | string | undefined,
): Promise<Item | undefined> {
  if (!name || !id) window.location.href = '/NotFound';
  const token = getToken();
  if (!token) {
    console.error('Token expiered');
    window.location.href = '/';
  }

  const url = `http://localhost:3000/category/${name}/${id}`;
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (e) {
    console.error(JSON.stringify(e));
  }
}
