import dotenv from 'dotenv';

dotenv.config();

export const env = {
  PORT: Number(process.env.PORT || '3007'),
  DATABASE_URL: process.env.DATABASE_URL || 'mysql://root:aerocode@localhost:3307/aerocode',
  JWT_SECRET: process.env.JWT_SECRET || 'aerocode_default_secret',
};
