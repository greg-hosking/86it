import dotenv from 'dotenv';

dotenv.config();

export default {
  server: {
    port: process.env.PORT,
    secret: process.env.SERVER_SECRET,
  },
  db: {
    uri: process.env.MONGODB_URI,
  },
  gmail: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
    secret: process.env.GMAIL_SECRET,
  },
};
