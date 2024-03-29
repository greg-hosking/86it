import nodemailer from 'nodemailer';

import config from './env.js';

export default nodemailer.createTransport({
  host: config.gmail.host,
  auth: {
    user: config.gmail.user,
    pass: config.gmail.pass,
  },
});
