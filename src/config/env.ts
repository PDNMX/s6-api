import * as yup from 'yup';
import * as dotenv from 'dotenv';

dotenv.config();

const envSchema = yup
  .object({
    PORT: yup.number().default(3000),
    NODE_ENV: yup.string().default('development'),
    MONGODB_URI: yup.string().required('MongoDB URI is required'),
    JWT_SECRET: yup.string().required('JWT Secret is required'),
    JWT_AUDIENCE: yup.string().required('JWT Audience is required'),
    JWT_ISSUER: yup.string().required('JWT IsUser is required'),
    JWT_EXPIRES_IN: yup.string().default('1d')
  })
  .required();

let config: any;

try {
  config = envSchema.validateSync({
    PORT: process.env.PORT ? parseInt(process.env.PORT) : undefined,
    NODE_ENV: process.env.NODE_ENV,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_AUDIENCE: process.env.JWT_AUDIENCE || 's6',
    JWT_ISSUER: process.env.JWT_ISSUER || 'pdn',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN
  });
} catch (error: any) {
  console.error('Environment configuration error:', error.message);
  process.exit(1);
}

console.log('config: ', config);

export default config;
