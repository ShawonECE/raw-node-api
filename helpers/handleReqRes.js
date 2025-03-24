/*
 * Title: Handle Request Response
 * Description: Handle Request Response
 * Author: Shahriar Shawon
 * Date: 22-03-2025
 */

// dependencies
import url from 'url';
import { StringDecoder } from 'string_decoder';
import { routes } from '../routes.js';
import { notFoundHandler } from '../handlers/routeHandlers/notFoundHandler.js';
import { parseJSON } from './utilities.js';

// handle request response
export const handleReqRes = (req, res) => {
    // request handle
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryStringObject = parsedUrl.query;
    const headersObject = req.headers;

    const requestProperties = {
        parsedUrl,
        path,
        trimmedPath,
        method,
        queryStringObject,
        headersObject,
    };

    const decoder = new StringDecoder('utf-8');
    let realData = '';

    const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler; 

    // return the final response
    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    });

    req.on('end', () => {
        realData += decoder.end();
        requestProperties.body = parseJSON(realData);

        chosenHandler(requestProperties, (statusCode, payload) => {
            statusCode = typeof statusCode === 'number' ? statusCode : 500;
            payload = typeof payload === 'object' ? payload : {};
    
            const payloadString = JSON.stringify(payload);
            
            // return the final response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
        });
    });

    // response handle
    // res.end('Hello World');
};