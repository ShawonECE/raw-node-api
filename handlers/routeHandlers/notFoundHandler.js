/*
 * Title: Not Found Handler
 * Description: 404 Not Found Handler
 * Author: Shahriar Shawon
 * Date: 22-03-2025
 */

export const notFoundHandler = (requestProperties, callback) => {
    callback(404, {
        message: 'Your requested URL was not found!',
    });
};

