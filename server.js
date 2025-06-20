import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import user from "./router/user.js";
import role from "./router/role.js";
import { testConnection } from "./db/connect.js";

dotenv.config();

const app = express();
const port = process.env.PORTFOREXPRESS || 3000;

const corsOptions = {
  origin: "http://localhost:5173", // for vite application
  optionsSuccessStatus: 200,
};

//middleware
app.use(cors(corsOptions));
app.use(express.json());

// api routes
app.use("/api/v1/user", user);
app.use("/api/v1/role", role);

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

testConnection();

