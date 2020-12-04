import express from "express";
import bodyParser from "body-parser";
import analyticsRoutes from './routes/analytics/analytics.routes';
import adminRoutes from './routes/admin/admin.routes';
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
    this.app.use(bodyParser.json({limit: '50mb'}));
    this.app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
    this.app.enable('trust proxy')
    const corsMiddleware = cors({
      origin: CLIENT_URL,
      credentials: true,
    })
    this.app.use(corsMiddleware)
    this.app.options('*', corsMiddleware)
  }

  routes() {
    this.app.use('/analytics', analyticsRoutes);
    this.app.use('/admin', adminRoutes);
  }

}

export default new App().app;