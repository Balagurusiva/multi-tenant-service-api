import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors"
import { setupSwagger } from "./config/swagger";

const app : Application = express()

app.use(helmet());
app.use(cors());
app.use(express.json());
setupSwagger(app);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

//global error handler
app.use(globalErrorHandler)

export default app;