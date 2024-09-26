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
import SignIn from './pages/SignIn/SignIn';

// CSS
import './assets/css/index.css';

import { Provider } from 'react-redux';
import store from './store/index';
import AllCategories from './pages/AllCategories/AllCategories';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

// Configuration des routes avec React Router
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/all',
    element: (
      <ProtectedRoute>
        <AllCategories />
      </ProtectedRoute>
    ),
  },
  {
    path: '/films',
    element: (
      <ProtectedRoute>
        <FilmsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/films/:id',
    element: (
      <ProtectedRoute>
        <FilmDetailsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/people',
    element: (
      <ProtectedRoute>
        <PeoplePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/people/:id',
    element: (
      <ProtectedRoute>
        <PeopleDetailsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/planets',
    element: (
      <ProtectedRoute>
        <PlanetsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/planets/:id',
    element: (
      <ProtectedRoute>
        <PlanetDetailsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/species',
    element: (
      <ProtectedRoute>
        <SpeciesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/species/:id',
    element: (
      <ProtectedRoute>
        <SpecieDetailsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/starships',
    element: (
      <ProtectedRoute>
        <StarshipPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/starships/:id',
    element: (
      <ProtectedRoute>
        <StarshipDetailsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/vehicles',

    element: (
      <ProtectedRoute>
        <VehiclesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/vehicles/:id',
    element: (
      <ProtectedRoute>
        <VehicleDetailsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/signin',
    element: <SignIn />,
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
