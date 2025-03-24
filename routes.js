/*
 * Title: Routes
 * Description: Application Routes
 * Author: Shahriar Shawon
 * Date: 22-03-2025
 */

// dependencies
import { sampleHandler } from './handlers/routeHandlers/sampleHandler.js';
import { userHandler } from './handlers/routeHandlers/userHandler.js';

export const routes = {
    sample: sampleHandler,
    user: userHandler,
};