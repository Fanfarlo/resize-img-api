import express from 'express';
import images from './api/imgRouter';

const routes = express.Router();

routes.use('/images', images);

export default routes;
