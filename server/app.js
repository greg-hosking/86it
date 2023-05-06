import express from 'express';
import mongoose from 'mongoose';

import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';

import routes from './routes/routes.js';
import createData from './utils/data.js';
import config from './utils/env.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// Connect to MongoDB
try {
  const uri =
    config.server.env === 'production'
      ? config.db.productionUri
      : config.db.developmentUri;
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  await mongoose.connect(uri, options);
  console.log('Connected to MongoDB');

  // Create data if in development
  // if (config.server.env !== 'production') {
  //   await mongoose.connection.db.dropDatabase();
  //   console.log('Dropped database');
  //   await createData();
  //   console.log('Created data');
  // }
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
  console.log(
    `${req.method} ${req.originalUrl} ${JSON.stringify(
      req.body
    )} ${JSON.stringify(req.params)}`
  );
  next();
});

// Set up routes
app.use('/api', routes);

// Serve static assets if in production
if (config.server.env === 'production') {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Server is running...');
  });
}

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
