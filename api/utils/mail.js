import config from './env.js';

import nodemailer from 'nodemailer';

export default nodemailer.createTransport({
  host: config.gmail.host,
  auth: {
    user: config.gmail.user,
    pass: config.gmail.pass,
  },
});
