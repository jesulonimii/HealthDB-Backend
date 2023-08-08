import express from "express";
import serverless from "serverless-http";
import dotenv from "dotenv";
import cors from "cors";

//Import Routes
import AuthRouter from "#routes/auth.route";
import AdminRouter from "#routes/admin.route";
import UserRouter from "#routes/user.route";
import AppointmentRouter from "#routes/appointment.route";
import ErrorRouter from "#routes/errors.route";
import NewsRouter from "#routes/news.route";

dotenv.config();


const app = express();

//Middlewares
app.use(express.json())
app.use(cors({
	origin: '*', //change to frontend url
}))

//Route Middlewares
app.use('/auth/', AuthRouter)
app.use('/admin/', AdminRouter)
app.use('/users/', UserRouter)
app.use('/appointments/', AppointmentRouter)
app.use('/news/', NewsRouter)
app.use('/*', ErrorRouter)








export default app;
export const handler = serverless(app);