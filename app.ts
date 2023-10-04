import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import { NextFunction, Request, Response } from 'express';
import { FeedController, MainController } from './src/controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { createExpressServer, getMetadataArgsStorage } from 'routing-controllers';

const app = createExpressServer({
  controllers: [FeedController, MainController],
  middlewares: [],
});

const storage = getMetadataArgsStorage();
const spec = routingControllersToSpec(storage,  {}, {
  info: {
    title: 'Daily Trends News',
    version: '1.0.0',
  },
});

// Swagger docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));

app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

// app.use(cors());
app.use(bodyParser.json());

//eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).send({ error: err.message });
});

export default app;
