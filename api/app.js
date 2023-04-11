// *****************
// Express app setup
// *****************
import express from 'express';

import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// **************
// Mongoose setup
// **************
import mongoose from 'mongoose';
import config from './utils/env.js';

await mongoose.connect(config.db.uri);

// ****************
// API routes setup
// ****************
import setupRoutes from './routes/router.js';

setupRoutes(app);

// ********************
// Error handling setup
// ********************
import createError from 'http-errors';

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, res) => {
  res.status(err.status || 500).send(err.message);
});

// *******************
// Express app startup
// *******************
const PORT = config.server.port || 3001;

app.listen(PORT);
console.log(`Server listening on port: ${PORT}`);
