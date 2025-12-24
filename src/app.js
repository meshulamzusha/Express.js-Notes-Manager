import express from 'express';
import healthRouter from './routes/healthRouter.js';
import registerRouter from './routes/userRegister.js';

const app = express();
const port = 3000;

app.use(express.json())


app.use('/health', healthRouter);
app.use('/register', registerRouter);


app.listen(port, () => {
    console.log(`app listening on port ${port}`);
})

console.log('App started');