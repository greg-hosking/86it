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

// ****************
// API routes setup
// ****************
import setupRoutes from './routes/router.js';

setupRoutes(app);

// ********************
// Error handling setup
// ********************
import createError from 'http-errors';

app.use((next) => {
  next(createError(404));
});

app.use((err, res) => {
  res.status(err.status || 500).send(err.message);
});

// *******************
// Express app startup
// *******************
import config from './utils/env.js';
const PORT = config.port || 3001;

app.listen(PORT);
console.log(`Server listening on port: ${PORT}`);
