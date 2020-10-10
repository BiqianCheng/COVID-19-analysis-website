import express from "express";
import bodyParser from "body-parser";
import testRoutes from './routes/test/test.routes';
import cors from 'cors';

export let CLIENT_URL = process.env.PRODUCTION
  ? process.env.CLIENT_URL : 'http://localhost:3000'

class App {
  app;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  config() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.enable('trust proxy')
    const corsMiddleware = cors({
      origin: CLIENT_URL,
      credentials: true,
    })
    this.app.use(corsMiddleware)
    this.app.options('*', corsMiddleware)
  }

  routes() {
    this.app.use('/test', testRoutes);
  }

}

export default new App().app;