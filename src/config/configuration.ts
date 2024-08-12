export default () => ({
  app: {
    port: parseInt(process.env.APP_PORT),
    fallbackLanguage: process.env.FALLBACK_LANGUAGE,
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
  redis: {
    host: process.env.REDIS_HOST,
    ttl: parseInt(process.env.REDIS_TTL),
    port: parseInt(process.env.REDIS_PORT) || 6379,
  },
  throttler: {
    limit: parseInt(process.env.RATE_LIMIT),
    ttl: parseInt(process.env.RATE_LIMITER_TTL),
  },
})
