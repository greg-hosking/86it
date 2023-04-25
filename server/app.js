import express from 'express';
import mongoose from 'mongoose';

import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import routes from './routes/routes.js';
import config from './utils/env.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// Connect to MongoDB
try {
  await mongoose.connect(config.db.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Connected to MongoDB');
} catch (err) {
  console.error('MongoDB connection error: ', err);
  process.exit(-1);
}

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error: ', err);
  process.exit(-1);
});

// Log requests to the console
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl} ${JSON.stringify(req.body)}`);
  next();
});

// Set up routes
app.use('/api', routes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, res) => {
  res.status(err.status || 500).send(err.message);
});

// Start the server
const PORT = config.server.port || 3001;
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
