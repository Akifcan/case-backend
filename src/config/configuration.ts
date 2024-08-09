export default () => ({
  app: {
    port: parseInt(process.env.APP_PORT),
    fallbackLanguage: process.env.fallbackLanguage,
  },
  database: {
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DATABASE_PORT) || 5432,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expires: process.env.JWT_EXPIRES_IN,
  },
})
