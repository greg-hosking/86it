import dotenv from 'dotenv';

dotenv.config();

export default {
  server: {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    secret: process.env.SERVER_SECRET,
  },
  db: {
    uri: process.env.MONGODB_URI,
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucket: process.env.AWS_BUCKET,
  },
  gmail: {
    host: 'smtp.gmail.com',
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
    secret: process.env.GMAIL_SECRET,
  },
};
