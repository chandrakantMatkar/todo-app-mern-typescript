import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import todoRoutes from './routes/todoRoutes'
import userRoutes from './routes/userRoutes'
import { mongoConnect } from "./database";
import cors from 'cors'

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// db connection
mongoConnect();

app.use(cors())
app.use(express.json());

//Routes 
app.use("/api/todo", todoRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
