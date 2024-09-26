import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export async function login(login: { username: string; password: string }) {
  const url: string = `http://localhost:3000/login`;
  try {
    const response = await axios.post(url, login);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
}

const isTokenExpired = (token: string) => {
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);

    return decoded.exp !== undefined && decoded.exp < currentTime;
  } catch (error) {
    console.error('Invalid token', error);
    return true;
  }
};

export const getToken = () => {
  const token: string | null = localStorage.getItem('token');
  if (token && isTokenExpired(token)) {
    return;
  } else {
    return token;
  }
};
