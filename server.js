import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import user from "./router/user.js";
import role from "./router/role.js";
import login from "./router/login.js";
import team from "./router/team.js";
import attendance from "./router/attendance.js";
import { connectdb } from './db/mongoConnect.js'
import { testConnection } from "./db/connect.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const mongoport = process.env.PORTFORMONGO || 27017;

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

const start = async () => {
    try {
        await connectdb(process.env.MONGO_URL, console.log("Connection Established with Database"))
        //Server Initiated
        app.listen(mongoport,
            console.log(`Mongo Listening at port ${mongoport}`));
    } catch (error) {
        console.log(error)
    }
}

start()

testConnection();

app.listen(port, () => {
  console.log(`Express server running on port ${port}`);
});


