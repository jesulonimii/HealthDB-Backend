"use strict";
import mongoose from "mongoose";
import app from "./app.js";
import { createServer } from "http";
import { attachSocket } from "./socket.js";

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost'


const server = createServer(app);

//Socket.io
attachSocket(server, app)


//Connect to DB
mongoose.set('strictQuery', true)
mongoose.connect(process.env.MONGODB_CONNECT, () => {
    console.log('\n\n\nDatabase connected!')

    server.listen(port, () => {
        console.log(`HealthDB API is live on port:${port}`)
        console.log(`Waiting on ${host}`)
    });
})


