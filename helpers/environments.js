const developmentEnvironment = {
    port: 3000,
    envName: 'development',
};

const productionEnvironment = {
    port: 5000,
    envName: 'production',
};

// determine which environment was passed
const currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'development';

// export corresponding environment object
export const environment = currentEnvironment === 'production' ? productionEnvironment : developmentEnvironment;