import express from "express";
import cors from "cors";
import user from "./router/user.js";
import role from "./router/role.js";
import login from "./router/login.js";
import team from "./router/team.js";
import attendance from "./router/attendance.js";
import { testConnection } from "./db/connect.js";
import config from "./utils/config.js";

const app = express();
const port = config.port || 3000;

//middleware
app.use(cors({ origin: "*" }));
app.set('trust proxy', true);
app.use(express.json());

// api routes
app.use("/api/v1/user", user);
app.use("/api/v1/role", role);
app.use("/api/v1/login", login);
app.use("/api/v1/team", team);
app.use("/api/v1/attendance", attendance);

testConnection();

app.listen(port, () => {
    console.log(`Express server running on port ${port}`);
});


