/*
 * Title: Uptime Monitoring Application
 * Description: A RESTful API to monitor up or down time of user defined links
 * Author: Shahriar Shawon
 * Date: 22-03-2025
 */

// Dependencies
import http from 'http';
import { handleReqRes } from './helpers/handleReqRes.js';
import { environment } from './helpers/environments.js';

// app object - module scaffolding
const app = {};

// handle request response
app.handleReqRes = handleReqRes;

// create a server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, () => {
        console.log(`Server is running on port ${environment.port}`);
    });
};

// start the server
app.createServer();