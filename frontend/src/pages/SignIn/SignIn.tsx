import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Style
import style from './SignIn.module.css';

// Service
import { login } from '../../services/auth.service';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<{
    error: string;
    login: { username: string; password: string };
  }>({
    error: '',
    login: {
      username: '',
      password: '',
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(state.login);
      navigate('/');
    } catch (error) {
      if (axios.isAxiosError(error) && error.status === 401) {
        setState((prevState) => ({
          ...prevState,
          error: 'The username or the password are incorrect',
        }));
      }
    }
  };

  return (
    <div className={style.signInContainer}>
      <form className={style.signInForm} onSubmit={handleSubmit}>
        <h2>Connexion</h2>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={state.login.username}
            onChange={(e) =>
              setState((prevState) => ({
                error: '',
                login: { ...prevState.login, username: e.target.value },
              }))
            }
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={state.login.password}
            onChange={(e) =>
              setState((prevState) => ({
                error: '',
                login: { ...prevState.login, password: e.target.value },
              }))
            }
            required
          />
        </div>
        <button type="submit">Sign In</button>
        {state.error && <p className={style.error}>{state.error}</p>}
      </form>
    </div>
  );
};

export default SignIn;
