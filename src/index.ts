import express from 'express';
import routes from './routes/index';

const app = express();
const port = 3000;

app.use('/api', routes);

app.get('/', (req, res) => {
  res.status(200).send('Server is working');
});

app.listen(port, () => {
  console.log(`Working on port ${port}`);
});

export default app;
