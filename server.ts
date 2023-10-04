import 'reflect-metadata';
import app from './app';
import bootstrap from './src/config/bootstrap.config';
import scheduleScraping from './src/workers/scrape.worker';

const PORT = 3000;

async function startServer() {
  await bootstrap();

  app.listen(PORT, () => {
    console.log(`Server started on port http://localhost:${PORT}`);
    scheduleScraping();
  });
}

startServer();
