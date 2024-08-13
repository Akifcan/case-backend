export interface AppConfig {
  port: number
  fallbackLanguage: string
  healthcheckUri: string
}

export interface DbConfig {
  host: string
  name: string
  password: string
  port: number
  user: string
}

export interface JwtProps {
  secret: string
  expires: string
}

export interface RedisConfig {
  host: string
  port: number
  ttl: number
}

export interface ThrottlerConfig {
  ttl: number
  limit: number
}

export interface CommentServiceConfig {
  host: string
  port: number
}
