import Hapi from '@hapi/hapi';
import jwt from '@hapi/jwt';

// Middleware
import { jwtAuthStrategy } from './middlewares/auth.middleware';

// Routes
import authRoutes from './routes/authRoutes';
import categoryRoutes from './routes/categoryRoutes';

const init = async (): Promise<void> => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
    routes: {
      cors: {
        origin: [
          'http://localhost:5173',
          'https://star-wars-rebels-alliance-search-system-frontend.vercel.app/',
        ], // Autorise le frontend
        credentials: true,
      },
    },
  });

  await server.register(jwt);

  server.auth.strategy('jwt', 'jwt', jwtAuthStrategy);

  const allRoutes = [...authRoutes, ...categoryRoutes];

  server.route(allRoutes);

  await server.start();

  console.log(`Serveur en cours d'exécution à l'adresse : ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
