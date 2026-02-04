import dotenv from 'dotenv';

dotenv.config();

export const envConfig = {
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    POSTGRES_DB: process.env.POSTGRES_DB,
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_PORT: process.env.DATABASE_PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
    RESET_TOKEN_EXPIRES_IN: process.env.RESET_TOKEN_EXPIRES_IN || '15m',
    API_URL: process.env.API_URL || `http://localhost:${process.env.PORT}`,
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
    PORT: process.env.PORT,
    MODE: process.env.MODE || 'dev',
    MAIL_HOST: process.env.MAIL_HOST,
    MAIL_PORT: process.env.MAIL_PORT,
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASS: process.env.MAIL_PASS,
    MAIL_FROM: process.env.MAIL_FROM || 'Intranet Antonelly',
} as const;