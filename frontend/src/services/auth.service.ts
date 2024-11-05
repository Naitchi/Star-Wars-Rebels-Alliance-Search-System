import axios, { AxiosResponse } from 'axios';
import { jwtDecode, JwtPayload } from 'jwt-decode';

// Fonction pour faire la requête pour le login
export async function login(login: { username: string; password: string }) {
  const url: string = `https://star-wars-rebels-alliance-search-system-backend.vercel.app/login`;
  try {
    const response: AxiosResponse = await axios.post(url, login);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
}

// Fonction pour vérifier le temps du token
const isTokenExpired = (token: string) => {
  if (!token) return true;

  try {
    const decoded: JwtPayload = jwtDecode(token);
    const currentTime: number = Math.floor(Date.now() / 1000);

    return decoded.exp !== undefined && decoded.exp < currentTime;
  } catch (error) {
    console.error('Invalid token', error);
    return true;
  }
};

// Fonction pour vérifier le token
export const getToken = () => {
  const token: string | null = localStorage.getItem('token');
  if (token && isTokenExpired(token)) {
    return;
  } else {
    return token;
  }
};
