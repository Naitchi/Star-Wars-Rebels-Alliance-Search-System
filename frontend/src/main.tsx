import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Pages
import App from './pages/App/App';
import NotFound from './pages/NotFound/NotFound';
import FilmsPage from './pages/FilmsPage/FilmsPage';
import PeoplePage from './pages/PeoplePage/PeoplePage';
import PlanetsPage from './pages/PlanetsPage/PlanetsPage';
import SpeciesPage from './pages/SpeciesPage/SpeciesPage';
import StarshipPage from './pages/StarshipPage/StarshipPage';
import VehiclesPage from './pages/VehiclesPage/VehiclesPage';

// CSS
import './assets/css/index.css';

import store from './store/index';
import { Provider } from 'react-redux';

// Configuration des routes avec React Router
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/films',
    element: <FilmsPage />,
  },
  {
    path: '/people',
    element: <PeoplePage />,
  },
  {
    path: '/planets',
    element: <PlanetsPage />,
  },
  {
    path: '/species',
    element: <SpeciesPage />,
  },
  {
    path: '/starship',
    element: <StarshipPage />,
  },
  {
    path: '/vehicles',
    element: <VehiclesPage />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

// Rendu de l'application avec RouterProvider
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);
