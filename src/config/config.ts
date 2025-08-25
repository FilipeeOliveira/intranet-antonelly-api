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
    JWT_EXP: process.env.JWT_EXP,
    PORT: process.env.PORT,
} as const;