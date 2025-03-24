// dependencies
import dotenv from "dotenv";

dotenv.config();

const developmentEnvironment = {
    port: 3000,
    envName: 'development',
    secretKey: process.env.SECRET_KEY,
};

const productionEnvironment = {
    port: 5000,
    envName: 'production',
    secretKey: process.env.SECRET_KEY,
};

// determine which environment was passed
const currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'development';

// export corresponding environment object
export const environment = currentEnvironment === 'production' ? productionEnvironment : developmentEnvironment;