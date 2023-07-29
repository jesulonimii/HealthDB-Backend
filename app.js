import express from "express";
import serverless from "serverless-http";
import mongoose from "mongoose";
import dotenv from "dotenv"

//Import Routes
import AuthRouter from "#routes/auth.route";
import bodyParser from "body-parser";


dotenv.config()


const app = express();


//Connect to DB
mongoose.connect(process.env.MONGODB_CONNECT, () => {
    console.log('Database connected!')
})

//Middlewares
app.use(express.json())

//Route Middlewares
app.use('/auth/', AuthRouter)


app.get("/", (req, res) => {
    res.end("Welcome to HealthDB Api");
})


export default app;
export const handler = serverless(app);