'use strict';
import mongoose from "mongoose";
import app from "./app.js";


// dotenv already set in app


const port = process.env.PORT || 3000
const host = process.env.HOST || 'localhost'


//Connect to DB
mongoose.connect(process.env.MONGODB_CONNECT, () => {
    console.log('\n\n\nDatabase connected!')

    app.listen(port, () => {
        console.log(`HealthDB API is live on port:${port}`)
        console.log(`Waiting on http://${host}:${port}`)
    });
})

