const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), 'src/config/.env') });

export const config = {
  'dev': {
    'username': process.env.devUsername,
    'password': process.env.devPassword,
    'database': process.env.devDatabase,
    'host': process.env.devHost,
    'dialect': process.env.devDialect,
    'aws_region': process.env.devAwsRegion,
    'aws_profile': process.env.devAwsProfile,
    'aws_media_bucket': process.env.devAwsMediaBucket
  },
  'jwt': {
    'secret': process.env.jwtSecret
  },
  'prod': {
    'username': process.env.prodUsername,
    'password': process.env.prodPassword,
    'database': process.env.prodDatabase,
    'host': process.env.prodHost,
    'dialect': process.env.prodDialect
  }
};
