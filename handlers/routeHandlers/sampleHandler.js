/*
 * Title: Sample Handler
 * Description: Sample Handler
 * Author: Shahriar Shawon
 * Date: 22-03-2025
 */

export const sampleHandler = (requestProperties, callback) => {
    // console.log(requestProperties);
    callback(200, {
        message: 'This is a sample url',
    });
};