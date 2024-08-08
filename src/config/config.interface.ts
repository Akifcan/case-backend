export interface AppConfig {
  port: number
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
