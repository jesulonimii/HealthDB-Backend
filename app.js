import express from "express";
import serverless from "serverless-http";
import mongoose from "mongoose";
import dotenv from "dotenv";

//Import Routes
import AuthRouter from "#routes/auth.route";
import UserRouter from "#routes/user.route";
import AppointmentRouter from "#routes/appointment.route";
import ErrorRouter from "#routes/errors.route";

dotenv.config();


const app = express();


//Connect to DB
mongoose.connect(process.env.MONGODB_CONNECT, () => {
    console.log('Database connected!')
})

//Middlewares
app.use(express.json())

//Route Middlewares
app.use('/auth/', AuthRouter)
app.use('/users/', UserRouter)
app.use('/appointments/', AppointmentRouter)
app.use('/*', ErrorRouter)








export default app;
export const handler = serverless(app);