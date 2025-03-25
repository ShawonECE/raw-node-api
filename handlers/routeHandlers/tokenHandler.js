/*
 * Title: Token Handler
 * Description: Handle Token Related Routes
 * Author: Shahriar Shawon
 * Date: 25-03-2025
 */

// dependencies
import { create, read, update, deleteFile } from '../../lib/data.js';
import { hash, parseJSON, createRandomString } from '../../helpers/utilities.js';

const _token = {};

_token.post = (requestProperties, callback) => {
    const phone = typeof requestProperties.body.phone === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;

    const password = typeof requestProperties.body.password === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    if (phone && password) {
        read('users', phone, (error, userData) => {
            const hashedPassword = hash(password);
            if (hashedPassword === parseJSON(userData).password) {
                const tokenId = createRandomString(20);
                const expires = Date.now() + 60 * 60 * 1000;
                const tokenObject = {
                    phone,
                    id: tokenId,
                    expires,
                };

                // store the token
                create('tokens', tokenId, tokenObject, (err) => {
                    if (!err) {
                        callback(200, tokenObject);
                    } else {
                        callback(500, {
                            error: 'There was a problem in the server side!',
                        });
                    }
                });
            } else {
                callback(400, {
                    error: 'Password is not valid!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'You have a problem in your request',
        });
    }
};

_token.get = (requestProperties, callback) => {
    // check the id is valid
    const id = typeof requestProperties.queryStringObject.id === 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id : false;
    if (id) {
        // lookup the token
        read('tokens', id, (err, tokenData) => {
            const token = { ...parseJSON(tokenData) };
            if (!err && token) {
                callback(200, token);
            } else {
                callback(404, {
                    error: 'Requested token was not found!',
                });
            }
        });
    } else {
        callback(404, {
            error: 'Requested token was not found!',
        });
    }
};

_token.put = (requestProperties, callback) => {
    // check the id is valid
    const id = typeof requestProperties.body.id === 'string' && requestProperties.body.id.trim().length === 20 ? requestProperties.body.id : false;

    const extend = typeof requestProperties.body.extend === 'boolean' && requestProperties.body.extend === true ? true : false;

    if (id && extend) {
        // lookup the token
        read('tokens', id, (err, tokenData) => {
            const tokenObject = parseJSON(tokenData);
            if (!err && tokenObject.expires > Date.now()) {
                tokenObject.expires = Date.now() + 60 * 60 * 1000;

                // store the updated token
                update('tokens', id, tokenObject, (error) => {
                    if (!error) {
                        callback(200);
                    } else {
                        callback(500, {
                            error: 'There was a server side error!',
                        });
                    }
                });
            } else {
                callback(400, {
                    error: 'Token already expired!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'You have a problem in your request',
        });
    }
};

_token.delete = (requestProperties, callback) => {
    // check the id is valid
    const id = typeof requestProperties.queryStringObject.id === 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id : false;
    if (id) {
        // lookup the token
        read('tokens', id, (err, tokenData) => {
            if (!err && tokenData) {
                // delete the token
                deleteFile('tokens', id, (error) => {
                    if (!error) {
                        callback(200, {
                            message: 'Token was successfully deleted!',
                        });
                    } else {
                        callback(500, {
                            error: 'There was a server side error!',
                        });
                    }
                });
            } else {
                callback(500, {
                    error: 'There was a server side error!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'You have a problem in your request',
        });
    }
};

export const tokenHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        _token[requestProperties.method](requestProperties, callback);
    } else {
        callback(405); 
    }
};