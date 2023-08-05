import express from "express";
import serverless from "serverless-http";
import dotenv from "dotenv";

//Import Routes
import AuthRouter from "#routes/auth.route";
import UserRouter from "#routes/user.route";
import AppointmentRouter from "#routes/appointment.route";
import ErrorRouter from "#routes/errors.route";
import NewsRouter from "#routes/news.route";

dotenv.config();


const app = express();

//Middlewares
app.use(express.json())

//Route Middlewares
app.use('/auth/', AuthRouter)
app.use('/users/', UserRouter)
app.use('/appointments/', AppointmentRouter)
app.use('/news/', NewsRouter)
app.use('/*', ErrorRouter)








export default app;
export const handler = serverless(app);