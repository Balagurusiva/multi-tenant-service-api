import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors"
import { setupSwagger } from "./config/swagger";
import { globalErrorHandler } from "./middlewares/error.middleware";

import tenantRoutes from './modules/tenants/tenant.routes'
import authRoutes from './modules/auth/auth.route'

const app : Application = express()

app.use(helmet());
app.use(cors());
app.use(express.json());
setupSwagger(app);

app.use('/api/v1', tenantRoutes)
app.use('/api/v1', authRoutes)

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

//global error handler
app.use(globalErrorHandler)

export default app;