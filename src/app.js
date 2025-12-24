import express from 'express';
import healthRouter from './routes/healthRouter.js';

const app = express();
const port = 3000;

app.use(express.json())


app.use('/health', healthRouter);


app.listen(port, () => {
    console.log(`app listening on port ${port}`);
})
