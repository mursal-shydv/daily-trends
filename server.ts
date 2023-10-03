import 'reflect-metadata';
import { FeedController } from './src/controllers';
import bootstrap from './src/config/bootstrap.config';
import { createExpressServer } from 'routing-controllers';
import scheduleScraping from './src/workers/scrape.worker';

const PORT = 3000;

async function startServer() {
  await bootstrap();

  const app = createExpressServer({
    controllers: [FeedController],
    middlewares: [],
  });

  app.listen(PORT, () => {
    console.log(`Server started on port http://localhost:${PORT}`);
    scheduleScraping();
  });
}

startServer();
