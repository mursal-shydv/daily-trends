import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(500).send({ error: err.message });
});

export default app;
