export interface JwtConfig {
  secret: string;
  expiresIn: string | number;
}

export interface DatabaseConfig {
  url: string;
}

export interface AppConfig {
  port: number;
  isProduction: boolean;
  jwt: JwtConfig;
  database: DatabaseConfig;
}