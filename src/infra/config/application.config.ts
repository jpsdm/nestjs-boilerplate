interface IConfig {
  PORT: number;
  NODE_ENV: string;
  APP_NAME: string;
  APP_VERSION: string;
  APP_HOST: string;
}

export default (): IConfig => ({
  PORT: parseInt(process.env.PORT, 10) || 3000,
  NODE_ENV: process.env.NODE_ENV,
  APP_NAME: process.env.APP_NAME,
  APP_VERSION: process.env.APP_VERSION,
  APP_HOST: process.env.APP_HOST,
});
