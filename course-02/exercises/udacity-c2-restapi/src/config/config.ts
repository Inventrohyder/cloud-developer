const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), 'src/config/.env') });

export const config = {
  'dev': {
    'username': process.env.POSTGRES_USERNAME,
    'password': process.env.POSTGRES_PASSWORD,
    'database': process.env.POSTGRES_DATABASE,
    'host': process.env.POSTGRES_HOST,
    'dialect': process.env.DATABASE_DIALECT,
    'aws_region': process.env.AWS_REGION,
    'aws_profile': process.env.AWS_PROFILE,
    'aws_media_bucket': process.env.AWS_MEDIA_BUCKET
  },
  'jwt': {
    'secret': process.env.JWT_SECRET
  },
  'prod': {
    'username': process.env.prodUsername,
    'password': process.env.prodPassword,
    'database': process.env.prodDatabase,
    'host': process.env.prodHost,
    'dialect': process.env.prodDialect
  }
};
