'use strict';

import app from "./app.js";


// dotenv already set in app


const port = process.env.PORT || 3000
const host = process.env.HOST || 'localhost'


app.listen(port, () => {
    console.log(`\n\n\nHealthDB API is live on port:${port}`)
    console.log(`Waiting on http://${host}:${port}`)
});