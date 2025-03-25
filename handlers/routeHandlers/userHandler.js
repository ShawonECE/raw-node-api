/*
 * Title: User Handler
 * Description: Handle User Route
 * Author: Shahriar Shawon
 * Date: 24-03-2025
 */

// dependencies
import { create, read, update, deleteFile } from '../../lib/data.js';
import { hash, parseJSON } from '../../helpers/utilities.js';
import { verifyToken } from './tokenHandler.js';

const _users = {};

_users.post = (requestProperties, callback) => {
    const firstName = typeof requestProperties.body.firstName === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;

    const lastName = typeof requestProperties.body.lastName === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;

    const phone = typeof requestProperties.body.phone === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;

    const password = typeof requestProperties.body.password === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    const tosAgreement = typeof requestProperties.body.tosAgreement === 'boolean' && requestProperties.body.tosAgreement ? true : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // make sure that the user does not already exist
        read('users', phone, (err, user) => {
            if (err) {
                const userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement,
                };

                // store the user to db
                create('users', phone, userObject, (err) => {
                    if (!err) {
                        callback(200, {
                            message: 'User was created successfully!',
                        });
                    } else {
                        callback(500, {
                            error: 'Could not create user!',
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
            message: 'You have a problem in your request',
        });
    }
};

_users.get = (requestProperties, callback) => {
    // check the phone number is valid
    const phone = typeof requestProperties.queryStringObject.phone === 'string' && requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone : false;

    if (phone) {
        // verify token
        const token = typeof requestProperties.headersObject.token === 'string' ? requestProperties.headersObject.token : false;

        verifyToken(token, phone, (tokenIsValid) => {
            if (tokenIsValid) {
                // lookup the user
                read('users', phone, (err, user) => {
                    const userData = { ...parseJSON(user) };
                    if (!err && userData) {
                        delete userData.password;
                        callback(200, userData);
                    } else {
                        callback(404, {
                            error: 'Requested user was not found!',
                        });
                    }
                });
            } else {
                callback(403, {
                    error: 'Authentication failure!',
                });
            }
        });
    } else {
        callback(404, {
            error: 'Invalid phone number!',
        });
    }
};

_users.put = (requestProperties, callback) => {
    // check the phone number is valid
    const phone = typeof requestProperties.body.phone === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;

    const firstName = typeof requestProperties.body.firstName === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;

    const lastName = typeof requestProperties.body.lastName === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;

    const password = typeof requestProperties.body.password === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    if (phone) {
        if (firstName || lastName || password) {
            // verify token
            const token = typeof requestProperties.headersObject.token === 'string' ? requestProperties.headersObject.token : false;

            verifyToken(token, phone, (tokenIsValid) => {
                if (tokenIsValid) {
                    // lookup the user
                    read('users', phone, (error, userData) => {
                        const userDataObject = { ...parseJSON(userData) };
                        if (!error && userDataObject) {
                            if (firstName) {
                                userDataObject.firstName = firstName;
                            }
                            if (lastName) {
                                userDataObject.lastName = lastName;
                            }
                            if (password) {
                                userDataObject.password = hash(password);
                            }

                            // store to database
                            update('users', phone, userDataObject, (err) => {
                                if (!err) {
                                    callback(200, {
                                        message: 'User was updated successfully!',
                                    });
                                } else {
                                    callback(500, {
                                        error: 'Could not update user!',
                                    });
                                }
                            });
                        } else {
                            callback(400, {
                                error: 'You have a problem in your request!',
                            });
                        }
                    });
                } else {
                    callback(403, {
                        error: 'Authentication failure!',
                    });
                }
            });
        } else {
            callback(400, {
                error: 'Invalid data!',
            });
        }
    } else {
        callback(400, {
            error: 'Invalid phone number. Please try again!',
        });
    }
};

_users.delete = (requestProperties, callback) => {
    // check the phone number is valid
    const phone = typeof requestProperties.queryStringObject.phone === 'string' && requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone : false;

    if (phone) {
        // verify token
        const token = typeof requestProperties.headersObject.token === 'string' ? requestProperties.headersObject.token : false;

        verifyToken(token, phone, (tokenIsValid) => {
            if (tokenIsValid) {
                // lookup the user
                read('users', phone, (error, userData) => {
                    if (!error && userData) {
                        deleteFile('users', phone, (err) => {
                            if (!err) {
                                callback(200, {
                                    message: 'User was successfully deleted!',
                                });
                            } else {
                                callback(500, {
                                    error: 'Could not delete the specified user!',
                                });
                            }
                        });
                    } else {
                        callback(500, {
                            error: 'Could not find the specified user!',
                        });
                    }
                });
            } else {
                callback(403, {
                    error: 'Authentication failure!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'There was a problem in your request!',
        });
    }
};

export const userHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        _users[requestProperties.method](requestProperties, callback);
    } else {
        callback(405); 
    }
};