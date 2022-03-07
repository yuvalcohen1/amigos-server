import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connect } from "mongoose";
import { config } from "dotenv";
import { usersRouter } from "./routers/users";
config();

const { PORT, MONGODB_URL, DB_NAME } = process.env;

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/users", usersRouter);

startServer();

async function startServer() {
  await connect(`${MONGODB_URL}/${DB_NAME}`);
  app.listen(PORT, () => console.log(`server is up at ${PORT}`));
}