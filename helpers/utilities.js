/*
 * Title: Utilities
 * Description: Important utility functions
 * Author: Shahriar Shawon
 * Date: 24-03-2025
 */

// dependencies
import crypto from 'crypto';
import { environment } from './environments.js';

// parse JSON string to object
export const parseJSON = (jsonString) => {
    let output;
    try {
        output = JSON.parse(jsonString);
    } catch {
        output = {};
    }
    return output;
};

// hash string
export const hash = (str) => {
    if (typeof str === 'string' && str.length > 0) {
        const hashed = crypto.createHmac('sha256', environment.secretKey).update(str).digest('hex');
        return hashed;
    } else {
        return false;
    }
};

// create random string
export const createRandomString = (strLength) => {
    let length = strLength;
    length = typeof strLength === 'number' && strLength > 0 ? strLength : false;
    if (length) {
        const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let output = '';
        for (let i = 1; i <= length; i++) {
            const randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            output += randomCharacter;
        }
        return output;
    }
    return false;
};