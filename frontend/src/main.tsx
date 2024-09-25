import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Pages
import App from './pages/App/App';
import FilmDetailsPage from './pages/FilmDetailsPage/FilmDetailsPage';
import FilmsPage from './pages/FilmsPage/FilmsPage';
import NotFound from './pages/NotFound/NotFound';
import PeopleDetailsPage from './pages/PeopleDetailsPage/PeopleDetailsPage';
import PeoplePage from './pages/PeoplePage/PeoplePage';
import PlanetDetailsPage from './pages/PlanetDetailsPage/PlanetDetailsPage';
import PlanetsPage from './pages/PlanetsPage/PlanetsPage';
import SpecieDetailsPage from './pages/SpecieDetailsPage/SpecieDetailsPage';
import SpeciesPage from './pages/SpeciesPage/SpeciesPage';
import StarshipDetailsPage from './pages/StarshipDetailsPage/StarshipDetailsPage';
import StarshipPage from './pages/StarshipPage/StarshipPage';
import VehicleDetailsPage from './pages/VehicleDetailsPage/VehicleDetailsPage';
import VehiclesPage from './pages/VehiclesPage/VehiclesPage';

// CSS
import './assets/css/index.css';

import { Provider } from 'react-redux';
import store from './store/index';
import AllCategories from './pages/AllCategories/AllCategories';

// Configuration des routes avec React Router
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/all',
    element: <AllCategories />,
  },
  {
    path: '/films',
    element: <FilmsPage />,
  },
  {
    path: '/films/:id',
    element: <FilmDetailsPage />,
  },
  {
    path: '/people',
    element: <PeoplePage />,
  },
  {
    path: '/people/:id',
    element: <PeopleDetailsPage />,
  },
  {
    path: '/planets',
    element: <PlanetsPage />,
  },
  {
    path: '/planets/:id',
    element: <PlanetDetailsPage />,
  },
  {
    path: '/species',
    element: <SpeciesPage />,
  },
  {
    path: '/species/:id',
    element: <SpecieDetailsPage />,
  },
  {
    path: '/starships',
    element: <StarshipPage />,
  },
  {
    path: '/starships/:id',
    element: <StarshipDetailsPage />,
  },
  {
    path: '/vehicles',
    element: <VehiclesPage />,
  },
  {
    path: '/vehicles/:id',
    element: <VehicleDetailsPage />,
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
