export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';
export const APP_BASE_URL =
  process.env.NEXT_PUBLIC_APP_BASE_URL || 'http://localhost:3000';
export const ACCESS_TOKEN_COOKIE_KEY =
  process.env.ACCESS_TOKEN_COOKIE_KEY || 'access_token';
export const REFRESH_TOKEN_COOKIE_KEY =
  process.env.REFRESH_TOKEN_COOKIE_KEY || 'refresh_token';
export const NODE_ENV = process.env.NODE_ENV;
