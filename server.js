import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";


const app = express();

dotenv.config();

app.use(cors({
    origin: process.env.FRONT_URL, 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true

  }));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);

const MONGO_URI = process.env.MONGO_URL ;
mongoose.connect(MONGO_URI)
.then(() => console.log("db is connected"))
.catch((err) => console.log(err))


const port =  process.env.PORT || 5000

app.listen(port, () => {
    console.log(`server is listening on http://localhost:${port}`)
})