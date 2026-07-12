import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import router from "./routes/auth.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://work-bench-ai.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    service: "auth",
    status: "ok"
  });
});

app.use("/", router);

app.listen(port, () => {
  connectDB();
  console.log(`auth service running on ${port}`);
});