export default () => ({
  app: {
    port: parseInt(process.env.PORT),
  },
  database: {
    host: process.env.DATABASE_HOST,
    name: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DATABASE_PORT) || 5432,
  },
})
